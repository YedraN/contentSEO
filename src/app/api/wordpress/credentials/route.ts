import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";
import { testWordPressConnection } from "@/lib/wordpress";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/lib/plans";
import { verifyAuth, getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wordpressUrl, wordpressUsername, wordpressPassword, action } = body;

    if (action === "test") {
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

      if (!wordpressUrl || !wordpressUsername || !wordpressPassword) {
        return NextResponse.json({ success: false, error: "Faltan datos para probar la conexión" }, { status: 400 });
      }

      const result = await testWordPressConnection({
        url: wordpressUrl,
        username: wordpressUsername,
        password: wordpressPassword,
      });

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "Conexión exitosa" });
    }

    if (action === "save") {
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

      if (!wordpressUrl || !wordpressUsername || !wordpressPassword) {
        return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 });
      }

      const result = await testWordPressConnection({
        url: wordpressUrl,
        username: wordpressUsername,
        password: wordpressPassword,
      });

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: auth.userId },
        data: {
          wordpressUrl,
          wordpressUsername: encrypt(wordpressUsername),
          wordpressPassword: encrypt(wordpressPassword),
          wordpressConnected: true,
        },
      });

      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
      await prisma.auditLog.create({
        data: {
          userId: auth.userId,
          action: "wp_credentials_saved",
          ipAddress: ip,
          userAgent: request.headers.get("user-agent") ?? null,
          metadata: { url: wordpressUrl },
        },
      }).catch(() => {});

      return NextResponse.json({ success: true, message: "Credenciales guardadas" });
    }

    if (action === "disconnect") {
      const userId = await verifyAuth(request);
      if (!userId) {
        return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          wordpressUrl: null,
          wordpressUsername: null,
          wordpressPassword: null,
          wordpressConnected: false,
        },
      });

      return NextResponse.json({ success: true, message: "Desconectado" });
    }

    return NextResponse.json({ success: false, error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error gestionando credenciales WordPress:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    if (!hasFeature(auth.user.subscriptionPlan, "wordpress")) {
      return NextResponse.json({ success: true, data: { connected: false, url: null } });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { wordpressConnected: true, wordpressUrl: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        connected: user?.wordpressConnected ?? false,
        url: user?.wordpressUrl ?? null,
      },
    });
  } catch (error) {
    console.error("Error obteniendo status WordPress:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
