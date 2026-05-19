import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { articles: true } } },
    });

    return NextResponse.json({
      success: true,
      data: clients.map((c) => ({
        id: c.id,
        name: c.name,
        companyType: c.companyType,
        defaultTone: c.defaultTone,
        defaultLanguage: c.defaultLanguage,
        articleCount: c._count.articles,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error listando clientes:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const { name, companyType, defaultTone, defaultLanguage } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "El nombre del cliente es requerido" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        userId: decoded.userId,
        name: name.trim(),
        companyType: companyType || "SaaS",
        defaultTone: defaultTone || "professional",
        defaultLanguage: defaultLanguage || "es",
      },
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error("Error creando cliente:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
