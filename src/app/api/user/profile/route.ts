import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api-auth";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, agencyName } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "El nombre es requerido" }, { status: 400 });
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ success: false, error: "El nombre no puede superar 100 caracteres" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        name: name.trim(),
        agencyName: agencyName?.trim() || null,
      },
      select: { id: true, name: true, agencyName: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
