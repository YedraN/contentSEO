import { NextRequest, NextResponse } from "next/server";
import { testWordPressConnection } from "@/lib/wordpress";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/lib/plans";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    if (!user.wordpressUrl || !user.wordpressUsername || !user.wordpressPassword) {
      return NextResponse.json(
        { success: false, error: "Credenciales de WordPress no configuradas" },
        { status: 400 }
      );
    }

    const isConnected = await testWordPressConnection({
      url: user.wordpressUrl,
      username: decrypt(user.wordpressUsername),
      password: decrypt(user.wordpressPassword),
    });

    if (isConnected) {
      return NextResponse.json({ success: true, message: "Conexión exitosa" });
    } else {
      return NextResponse.json(
        { success: false, error: "No se pudo conectar a WordPress. Verifica URL y credenciales." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error testeando conexión WordPress:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
