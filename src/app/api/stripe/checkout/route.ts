import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, SUBSCRIPTION_PLANS } from "@/lib/stripe";
import { verifyAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !Object.keys(SUBSCRIPTION_PLANS).includes(plan)) {
      return NextResponse.json(
        { success: false, error: "Plan inválido" },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(userId, plan);

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
    console.error("Error en checkout:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
