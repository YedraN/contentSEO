import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { getWordPressCategories, getWordPressTags } from "@/lib/wordpress";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/lib/plans";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    if (!hasFeature(auth.user.subscriptionPlan, "wordpress")) {
      return NextResponse.json(
        { success: false, error: "Esta feature requiere el plan Pro o Agency" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        wordpressConnected: true,
        wordpressUrl: true,
        wordpressUsername: true,
        wordpressPassword: true,
      },
    });

    if (!user?.wordpressConnected || !user.wordpressUrl || !user.wordpressUsername || !user.wordpressPassword) {
      return NextResponse.json(
        { success: false, error: "WordPress no está conectado" },
        { status: 400 }
      );
    }

    const config = {
      url: user.wordpressUrl,
      username: decrypt(user.wordpressUsername),
      password: decrypt(user.wordpressPassword),
    };

    const [categories, tags] = await Promise.all([
      getWordPressCategories(config),
      getWordPressTags(config),
    ]);

    return NextResponse.json({ success: true, data: { categories, tags } });
  } catch (error) {
    console.error("Error obteniendo taxonomías WordPress:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
