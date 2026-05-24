import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import { prisma } from "./db";
import { validateEmail, validatePassword } from "./utils";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_EXPIRATION = "30d";

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRATION)
    .sign(getSecret());
}

export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as { userId: string };
  } catch {
    return null;
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  agencyName?: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  // Validar email
  if (!validateEmail(email)) {
    return { success: false, error: "Email inválido" };
  }

  // Validar contraseña
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.errors[0] };
  }

  // Verificar si email ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: "Este email ya está registrado" };
  }

  // Hash de la contraseña
  const hashedPassword = await hashPassword(password);

  // Crear usuario
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        agencyName: agencyName || null,
        credits: 1, // 1 crédito de prueba
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        agencyName: user.agencyName,
        credits: user.credits,
      },
    };
  } catch (error) {
    return { success: false, error: "Error al crear usuario" };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
  // Validar email
  if (!validateEmail(email)) {
    return { success: false, error: "Email inválido" };
  }

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: "Email o contraseña incorrectos" };
  }

  // Validar contraseña
  const passwordMatch = await comparePasswords(password, user.password);

  if (!passwordMatch) {
    return { success: false, error: "Email o contraseña incorrectos" };
  }

  // Crear token
  const token = await createToken(user.id);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
    },
  };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      agencyName: true,
      credits: true,
      createdAt: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      articlesLimitPerMonth: true,
      articlesUsedThisMonth: true,
      billingCycleEnd: true,
      defaultLanguage: true,
      defaultTone: true,
    },
  });
}

export async function updateUserCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function deductCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < amount) {
      return false;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Atomically checks and deducts credits/usage within a Prisma transaction.
 * Uses conditional UPDATE (WHERE credits >= N) to prevent race conditions
 * when multiple requests arrive simultaneously for the same user.
 *
 * Returns `{ success: true, usedSubscription }` on success so the caller
 * knows which balance to refund on failure.
 */
export async function checkAndIncrementUsage(
  userId: string,
  articlesToGenerate: number
): Promise<{ success: boolean; usedSubscription?: boolean; error?: string }> {
  try {
    // Read the user first to determine their billing mode and to produce a
    // human-readable error message with the exact remaining count.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionStatus: true,
        articlesUsedThisMonth: true,
        articlesLimitPerMonth: true,
        credits: true,
      },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // --- Subscription path ---
    if (user.subscriptionStatus === "active") {
      const remaining = user.articlesLimitPerMonth - (user.articlesUsedThisMonth || 0);
      if (remaining < articlesToGenerate) {
        return {
          success: false,
          error: `Límite mensual alcanzado. Dispones de ${remaining} artículo${remaining !== 1 ? "s" : ""} más este mes.`,
        };
      }

      // Atomic increment: only succeeds if the check still passes at commit time.
      const updated = await prisma.user.updateMany({
        where: {
          id: userId,
          articlesUsedThisMonth: { lte: user.articlesLimitPerMonth - articlesToGenerate },
        },
        data: { articlesUsedThisMonth: { increment: articlesToGenerate } },
      });

      if (updated.count === 0) {
        return { success: false, error: "Límite mensual alcanzado (intento concurrente detectado)." };
      }

      return { success: true, usedSubscription: true };
    }

    // --- Credit path (trial / one-off) ---
    if ((user.credits || 0) < articlesToGenerate) {
      return { success: false, error: "Créditos insuficientes" };
    }

    const updated = await prisma.user.updateMany({
      where: {
        id: userId,
        credits: { gte: articlesToGenerate },
      },
      data: { credits: { decrement: articlesToGenerate } },
    });

    if (updated.count === 0) {
      return { success: false, error: "Créditos insuficientes (intento concurrente detectado)." };
    }

    return { success: true, usedSubscription: false };
  } catch (error) {
    console.error("Error checking article usage:", error);
    return { success: false, error: "Error procesando solicitud" };
  }
}

/**
 * Refunds credits or monthly usage for a user after a failed generation.
 * Called from the Inngest onFailure handler.
 */
export async function refundCredits(
  userId: string,
  amount: number,
  usedSubscription: boolean
): Promise<void> {
  try {
    if (usedSubscription) {
      await prisma.user.update({
        where: { id: userId },
        data: { articlesUsedThisMonth: { decrement: amount } },
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } },
      });
    }
  } catch (error) {
    console.error("Error refunding credits:", error);
  }
}
