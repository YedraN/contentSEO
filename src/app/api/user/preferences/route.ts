import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

const VALID_LANGUAGES = ["es", "en", "fr", "de", "it", "pt", "nl", "pl"];
const VALID_TONES = ["professional", "casual", "technical", "creative", "persuasive"];

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { defaultLanguage, defaultTone } = body;

    if (defaultLanguage && !VALID_LANGUAGES.includes(defaultLanguage)) {
      return NextResponse.json({ success: false, error: "Idioma no válido" }, { status: 400 });
    }

    if (defaultTone && !VALID_TONES.includes(defaultTone)) {
      return NextResponse.json({ success: false, error: "Tono no válido" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        ...(defaultLanguage && { defaultLanguage }),
        ...(defaultTone && { defaultTone }),
      },
      select: { id: true, defaultLanguage: true, defaultTone: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error actualizando preferencias:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
