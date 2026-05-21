import { NextRequest, NextResponse } from "next/server";
import { deductCredits } from "@/lib/auth";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Cantidad inválida" },
        { status: 400 }
      );
    }

    const success = await deductCredits(userId, amount);

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
