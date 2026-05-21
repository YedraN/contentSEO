import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const profiles = await prisma.voiceProfile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        sampleCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    console.error("Error listando perfiles de voz:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 });
    }

    const profile = await prisma.voiceProfile.findUnique({
      where: { id },
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
