import { NextRequest, NextResponse } from "next/server";
import { analyzeWritingStyle } from "@/lib/voice";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, articles } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "El nombre del perfil es requerido" }, { status: 400 });
    }

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ success: false, error: "Debes proporcionar al menos un artículo" }, { status: 400 });
    }

    if (articles.length > 5) {
      return NextResponse.json({ success: false, error: "Máximo 5 artículos para entrenar" }, { status: 400 });
    }

    for (let i = 0; i < articles.length; i++) {
      if (!articles[i] || typeof articles[i] !== "string" || articles[i].trim().length < 100) {
        return NextResponse.json(
          { success: false, error: `El artículo ${i + 1} es demasiado corto (mín. 100 caracteres)` },
          { status: 400 }
        );
      }
    }

    const styleGuide = await analyzeWritingStyle(articles.map((a: string) => a.trim()));

    if (!styleGuide) {
      return NextResponse.json({ success: false, error: "Error analizando el estilo de escritura" }, { status: 500 });
    }

    const profile = await prisma.voiceProfile.create({
      data: {
        userId,
        name: name.trim(),
        styleGuide: JSON.stringify(styleGuide),
        sampleCount: articles.length,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: profile.id,
          name: profile.name,
          sampleCount: profile.sampleCount,
          styleGuide,
          createdAt: profile.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error entrenando voz:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
