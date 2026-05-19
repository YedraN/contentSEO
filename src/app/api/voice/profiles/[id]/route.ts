import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const profile = await prisma.voiceProfile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Perfil no encontrado" }, { status: 404 });
    }

    if (profile.userId !== decoded.userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        styleGuide: JSON.parse(profile.styleGuide),
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil de voz:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const profile = await prisma.voiceProfile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Perfil no encontrado" }, { status: 404 });
    }

    if (profile.userId !== decoded.userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    await prisma.voiceProfile.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Perfil eliminado" });
  } catch (error) {
    console.error("Error eliminando perfil de voz:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
