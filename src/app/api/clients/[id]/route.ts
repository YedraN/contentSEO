import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: { _count: { select: { articles: true } } },
    });

    if (!client) {
      return NextResponse.json({ success: false, error: "Cliente no encontrado" }, { status: 404 });
    }

    if (client.userId !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...client,
        articleCount: client._count.articles,
      },
    });
  } catch (error) {
    console.error("Error obteniendo cliente:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const existing = await prisma.client.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Cliente no encontrado" }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { name, companyType, defaultTone, defaultLanguage } = body;

    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        ...(name?.trim() && { name: name.trim() }),
        ...(companyType && { companyType }),
        ...(defaultTone && { defaultTone }),
        ...(defaultLanguage && { defaultLanguage }),
      },
    });

    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error("Error actualizando cliente:", error);
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

    const existing = await prisma.client.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Cliente no encontrado" }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    await prisma.client.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
