import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth";
import { encrypt, decrypt } from "@/lib/encryption";
import { testWordPressConnection } from "@/lib/wordpress";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const { wordpressUrl, wordpressUsername, wordpressPassword, action } = body;

    if (action === "test") {
      const user = await getUserById(decoded.userId);
      if (!user || !hasFeature(user.subscriptionPlan, "wordpress")) {
        return NextResponse.json(
          { success: false, error: "Esta feature requiere el plan Pro o Agency" },
          { status: 403 }
        );
      }

      const isConnected = await testWordPressConnection({
        url: wordpressUrl,
        username: wordpressUsername,
        password: wordpressPassword,
      });

      if (!isConnected) {
        return NextResponse.json(
          { success: false, error: "No se pudo conectar. Verifica URL y credenciales." },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, message: "Conexión exitosa" });
    }

    if (action === "save") {
      const user = await getUserById(decoded.userId);
      if (!user || !hasFeature(user.subscriptionPlan, "wordpress")) {
        return NextResponse.json(
          { success: false, error: "Esta feature requiere el plan Pro o Agency" },
          { status: 403 }
        );
      }

      if (!wordpressUrl || !wordpressUsername || !wordpressPassword) {
        return NextResponse.json(
          { success: false, error: "Faltan datos requeridos" },
          { status: 400 }
        );
      }

      const isConnected = await testWordPressConnection({
        url: wordpressUrl,
        username: wordpressUsername,
        password: wordpressPassword,
      });

      if (!isConnected) {
        return NextResponse.json(
          { success: false, error: "No se pudo conectar a WordPress" },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          wordpressUrl,
          wordpressUsername,
          wordpressPassword: encrypt(wordpressPassword),
          wordpressConnected: true,
        },
      });

      return NextResponse.json({ success: true, message: "Credenciales guardadas" });
    }

    if (action === "disconnect") {
      await prisma.user.update({
        where: { id: decoded.userId },
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
    console.error("Error gestionando credenciales WordPress:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
    console.error("Error obteniendo status WordPress:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
