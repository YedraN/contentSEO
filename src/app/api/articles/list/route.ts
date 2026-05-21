import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const clientFilter = url.searchParams.get("clientId") || "";

    const where = { userId };
    if (clientFilter) {
      (where as any).clientId = clientFilter;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          keywords: true,
          companyName: true,
          companyType: true,
          readingTime: true,
          createdAt: true,
          clientId: true,
          client: { select: { name: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          articles,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listando artículos:", error);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
