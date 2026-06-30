import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyWebhookSignature, handleSubscriptionCreated, handleSubscriptionUpdated, SUBSCRIPTION_PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getPlanArticleLimit(plan: string): number {
  const p = plan as keyof typeof SUBSCRIPTION_PLANS;
  return SUBSCRIPTION_PLANS[p]?.articles || 0;
}

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
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const result = await handleSubscriptionCreated(subscription);

        if (result.success && result.userId && result.plan) {
          const articlesLimit = getPlanArticleLimit(result.plan);
          const now = new Date();
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

          await prisma.user.update({
            where: { id: result.userId },
            data: {
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: "active",
              subscriptionPlan: result.plan,
              articlesLimitPerMonth: articlesLimit,
              articlesUsedThisMonth: 0,
              billingCycleStart: now,
              billingCycleEnd: nextMonth,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const result = await handleSubscriptionUpdated(subscription);

        if (result.success && result.userId) {
          const plan = subscription.metadata?.plan;
          const articlesLimit = plan ? getPlanArticleLimit(plan) : 0;

          await prisma.user.update({
            where: { id: result.userId },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionPlan: plan,
              articlesLimitPerMonth: articlesLimit,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: "canceled",
              articlesLimitPerMonth: 0,
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (user && user.subscriptionPlan) {
            const articlesLimit = getPlanArticleLimit(user.subscriptionPlan);
            const now = new Date();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

            // Reset monthly usage at start of billing cycle
            await prisma.user.update({
              where: { id: user.id },
              data: {
                articlesUsedThisMonth: 0,
                billingCycleStart: now,
                billingCycleEnd: nextMonth,
                articlesLimitPerMonth: articlesLimit,
              },
            });
          }
        }
        break;
      }

      default:
        console.log(`Evento sin procesar: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error en webhook de Stripe:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}
