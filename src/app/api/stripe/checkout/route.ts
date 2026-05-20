import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createCheckoutSession, SUBSCRIPTION_PLANS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    const { plan } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    if (!plan || !Object.keys(SUBSCRIPTION_PLANS).includes(plan)) {
      return NextResponse.json(
        { success: false, error: "Plan inválido" },
        { status: 400 }
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const session = await createCheckoutSession(decoded.userId, plan);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Error creando sesión de pago" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          checkoutUrl: session.url,
          sessionId: session.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
