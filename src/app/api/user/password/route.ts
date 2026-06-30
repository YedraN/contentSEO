import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePasswords, hashPassword, createToken } from "@/lib/auth";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, sessionVersion: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const isMatch = await comparePasswords(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Contraseña actual incorrecta" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    const newSessionVersion = user.sessionVersion + 1;

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, sessionVersion: newSessionVersion },
    });

    // Audit log
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    await prisma.auditLog.create({
      data: {
        userId,
        action: "password_changed",
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") ?? null,
      },
    }).catch(() => {/* non-blocking */});

    // Issue a fresh token with the new session version and clear the old one
    const newToken = await createToken(userId, newSessionVersion);
    const response = NextResponse.json({ success: true, message: "Contraseña actualizada" });
    response.cookies.set({
      name: "token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error("Error actualizando contraseña:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
