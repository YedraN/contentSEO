import { NextRequest, NextResponse } from "next/server";
import { checkAndIncrementUsage } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { GenerateArticleRequest } from "@/types";
import { getAuthenticatedUser } from "@/lib/api-auth";
import type { GenerateArticleEventData } from "@/inngest/functions/generate-article";

export const dynamic = "force-dynamic";

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

    const { userId } = auth;

    // ── Debit credits atomically BEFORE creating the job ─────────────────────
    const usageCheck = await checkAndIncrementUsage(userId, numArticles);
    if (!usageCheck.success) {
      return NextResponse.json({ success: false, error: usageCheck.error }, { status: 400 });
    }

    // ── Resolve voice profile style guide (non-blocking read) ────────────────
    let styleGuide: string | undefined;
    if (voiceProfileId) {
      const profile = await prisma.voiceProfile.findUnique({
        where: { id: voiceProfileId },
        select: { userId: true, styleGuide: true },
      });
      if (profile && profile.userId === userId) {
        try {
          const parsed = JSON.parse(profile.styleGuide);
          styleGuide = parsed.styleGuide;
        } catch {}
      }
    }

    // ── Create GenerationJob record ───────────────────────────────────────────
    const job = await prisma.generationJob.create({
      data: {
        userId,
        status: "queued",
        totalItems: numArticles,
        payload: {
          companyName,
          companyType,
          keywords,
          tone,
          numArticles,
          language,
          voiceProfileId: voiceProfileId ?? null,
          clientId: clientId ?? null,
          styleGuide: styleGuide ?? null,
        },
      },
    });

    // ── Send event to Inngest ─────────────────────────────────────────────────
    await inngest.send({
      name: "article/generate.requested",
      data: {
        jobId: job.id,
        userId,
        usedSubscription: usageCheck.usedSubscription ?? false,
        articlesToCharge: numArticles,
        payload: {
          companyName,
          companyType,
          keywords,
          tone,
          numArticles,
          language,
          voiceProfileId,
          clientId,
          styleGuide,
        },
      } satisfies GenerateArticleEventData,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          jobId: job.id,
          status: "queued",
          totalItems: numArticles,
        },
      },
      { status: 202 } // 202 Accepted — processing async
    );
  } catch (error) {
    console.error("Error encolando generación de artículos:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
