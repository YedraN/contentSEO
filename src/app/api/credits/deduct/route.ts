import { NextRequest, NextResponse } from "next/server";
import { verifyToken, deductCredits } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const { amount } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Cantidad inválida" },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const success = await deductCredits(decoded.userId, amount);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Créditos insuficientes" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Créditos deducidos correctamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deduciendo créditos:", error);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
