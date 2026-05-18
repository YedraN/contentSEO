import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyWebhookSignature, handleCheckoutSessionCompleted } from "@/lib/stripe";
import { updateUserCredits } from "@/lib/auth";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Firma no encontrada" },
        { status: 400 }
      );
    }

    const event = verifyWebhookSignature(body, signature);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Firma inválida" },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const result = await handleCheckoutSessionCompleted(session);

        if (result.success && result.userId && result.credits) {
          await updateUserCredits(result.userId, result.credits);

          await prisma.creditPurchase.create({
            data: {
              userId: result.userId,
              stripeSessionId: session.id,
              amount: result.credits,
              price: (session.amount_total || 0) / 100,
              status: "completed",
            },
          });
        }
        break;

      case "checkout.session.expired":
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        if (expiredSession.metadata?.userId) {
          await prisma.creditPurchase.updateMany({
            where: {
              stripeSessionId: expiredSession.id,
            },
            data: {
              status: "failed",
            },
          });
        }
        break;

      default:
        console.log(`Evento sin procesar: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error en webhook de Stripe:", error);
    return NextResponse.json(
      { success: false, error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}
