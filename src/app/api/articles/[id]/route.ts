import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
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

    const article = await prisma.article.findUnique({ where: { id: params.id } });

    if (!article) {
      return NextResponse.json({ success: false, error: "Artículo no encontrado" }, { status: 404 });
    }

    if (article.userId !== decoded.userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Título y contenido son requeridos" },
        { status: 400 }
      );
    }

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: { title: title.trim(), content: content.trim() },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error actualizando artículo:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
