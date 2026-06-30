import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { publishPostToWordPress } from "@/lib/wordpress";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/lib/plans";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        wordpressConnected: true,
        wordpressUrl: true,
        wordpressUsername: true,
        wordpressPassword: true,
        subscriptionPlan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    if (!hasFeature(user.subscriptionPlan, "wordpress")) {
      return NextResponse.json(
        { success: false, error: "Esta feature requiere el plan Pro o Agency" },
        { status: 403 }
      );
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

    if (article.userId !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { status = "draft", categories = [], tags = [] } = body;

    const result = await publishPostToWordPress(
      {
        url: user.wordpressUrl,
        username: decrypt(user.wordpressUsername),
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

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    await prisma.auditLog.create({
      data: {
        userId,
        action: "wp_published",
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") ?? null,
        metadata: { articleId: params.id, postId: result.postId, status },
      },
    }).catch(() => {/* non-blocking */});

    return NextResponse.json({
      success: true,
      data: {
        postId: result.postId,
        postUrl: result.postUrl,
      },
    });
  } catch (error) {
    console.error("Error publicando a WordPress:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
