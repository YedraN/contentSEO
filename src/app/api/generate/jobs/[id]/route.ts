import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const job = await prisma.generationJob.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
        status: true,
        progress: true,
        totalItems: true,
        doneItems: true,
        resultIds: true,
        error: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!job) {
      return NextResponse.json({ success: false, error: "Job no encontrado" }, { status: 404 });
    }

    if (job.userId !== userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 403 });
    }

    // If completed, also fetch the article summaries for the UI
    let articles: Array<{ id: string; title: string; createdAt: Date }> | undefined;
    if (job.status === "completed" && Array.isArray(job.resultIds)) {
      articles = await prisma.article.findMany({
        where: { id: { in: job.resultIds as string[] } },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        totalItems: job.totalItems,
        doneItems: job.doneItems,
        error: job.error,
        articles,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error obteniendo estado del job:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
