import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const profile = await prisma.voiceProfile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Perfil no encontrado" }, { status: 404 });
    }

    if (profile.userId !== userId) {
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
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const profile = await prisma.voiceProfile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Perfil no encontrado" }, { status: 404 });
    }

    if (profile.userId !== userId) {
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
