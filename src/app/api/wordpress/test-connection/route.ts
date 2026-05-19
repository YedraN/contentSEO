import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { testWordPressConnection } from "@/lib/wordpress";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/db";

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
      username: user.wordpressUsername,
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
    console.error("Error testeando conexión WordPress:", error);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
