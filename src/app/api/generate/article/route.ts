import { NextRequest, NextResponse } from "next/server";
import { checkAndIncrementUsage } from "@/lib/auth";
import { generateMultipleArticles } from "@/lib/groq";
import { prisma } from "@/lib/db";
import { GenerateArticleRequest } from "@/types";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
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

    const { user, userId } = auth;

    const usageCheck = await checkAndIncrementUsage(userId, numArticles);
    if (!usageCheck.success) {
      return NextResponse.json(
        { success: false, error: usageCheck.error },
        { status: 400 }
      );
    }

    let styleGuide: string | undefined;
    if (voiceProfileId) {
      const profile = await prisma.voiceProfile.findUnique({
        where: { id: voiceProfileId },
      });
      if (profile && profile.userId === userId) {
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

    const savedArticles = await Promise.all(
      articles.map((article) =>
        prisma.article.create({
          data: {
            userId,
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

    let remaining: number;
    if (user.subscriptionStatus === "active") {
      remaining = user.articlesLimitPerMonth - ((user.articlesUsedThisMonth || 0) + articles.length);
    } else {
      remaining = user.credits - articles.length;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          articles: savedArticles,
          articlesUsed: articles.length,
          articlesRemaining: remaining,
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
