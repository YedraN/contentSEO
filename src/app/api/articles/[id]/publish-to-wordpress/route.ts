import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";
import { publishPostToWordPress } from "@/lib/wordpress";
import { prisma } from "@/lib/db";

export async function POST(
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    if (!user.wordpressConnected || !user.wordpressUrl || !user.wordpressUsername || !user.wordpressPassword) {
      return NextResponse.json(
        { success: false, error: "WordPress no está configurado" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Artículo no encontrado" }, { status: 404 });
    }

    if (article.userId !== decoded.userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { status = "draft", categories = [], tags = [] } = body;

    const result = await publishPostToWordPress(
      {
        url: user.wordpressUrl,
        username: user.wordpressUsername,
        password: decrypt(user.wordpressPassword),
      },
      {
        title: article.title,
        content: article.content,
        status: status as "draft" | "publish",
        categories,
        tags,
      }
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    await prisma.article.update({
      where: { id: params.id },
      data: {
        wordpressPostId: result.postId,
        wordpressPostUrl: result.postUrl,
        publishedToWp: true,
        publishedToWpAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        postId: result.postId,
        postUrl: result.postUrl,
      },
    });
  } catch (error) {
    console.error("Error publicando a WordPress:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
