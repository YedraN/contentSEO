import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById, deductCredits } from "@/lib/auth";
import { generateMultipleArticles } from "@/lib/claude";
import { prisma } from "@/lib/db";
import { GenerateArticleRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as GenerateArticleRequest;
    const {
      companyName,
      companyType,
      keywords,
      tone = "professional",
      numArticles = 1,
      language = "es",
      voiceProfileId,
      clientId,
    } = body;

    if (!companyName || !companyType || !keywords || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    if (numArticles < 1 || numArticles > 5) {
      return NextResponse.json(
        { success: false, error: "Número de artículos debe estar entre 1 y 5" },
        { status: 400 }
      );
    }

    const user = await getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.credits < numArticles) {
      return NextResponse.json(
        {
          success: false,
          error: `Créditos insuficientes. Necesitas ${numArticles}, tienes ${user.credits}`,
        },
        { status: 400 }
      );
    }

    let styleGuide: string | undefined;
    if (voiceProfileId) {
      const profile = await prisma.voiceProfile.findUnique({
        where: { id: voiceProfileId },
      });
      if (profile && profile.userId === decoded.userId) {
        const parsed = JSON.parse(profile.styleGuide);
        styleGuide = parsed.styleGuide;
      }
    }

    const articles = await generateMultipleArticles(
      companyName,
      companyType,
      keywords,
      tone,
      numArticles,
      language,
      styleGuide
    );

    if (articles.length === 0) {
      return NextResponse.json(
        { success: false, error: "Error generando artículos" },
        { status: 500 }
      );
    }

    const creditsDeducted = await deductCredits(decoded.userId, articles.length);

    if (!creditsDeducted) {
      return NextResponse.json(
        { success: false, error: "Error deduciendo créditos" },
        { status: 500 }
      );
    }

    const savedArticles = await Promise.all(
      articles.map((article) =>
        prisma.article.create({
          data: {
            userId: decoded.userId,
            title: article.title,
            content: article.content,
            keywords: JSON.stringify(article.keywords),
            companyName,
            companyType,
            metaDescription: article.metaDescription,
            readingTime: article.readingTime,
            ...(clientId && { clientId }),
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          articles: savedArticles,
          creditsUsed: articles.length,
          creditsRemaining: user.credits - articles.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generando artículos:", error);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
