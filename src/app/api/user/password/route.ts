import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePasswords, hashPassword } from "@/lib/auth";
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
      return NextResponse.json({ success: false, error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const isMatch = await comparePasswords(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Contraseña actual incorrecta" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    console.error("Error actualizando contraseña:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
