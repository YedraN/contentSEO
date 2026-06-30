import Stripe from "stripe";
import { PLANS } from "./plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function verifyWebhookSignature(body: string, signature: string): Stripe.Event | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set — webhook verification cannot proceed");
  }
  try {
    return stripe.webhooks.constructEvent(body, signature, secret) as Stripe.Event;
  } catch (error) {
    console.error("Error verificando webhook:", (error as Error).message);
    return null;
  }
}

export const SUBSCRIPTION_PLANS = {
  starter: {
    priceId: PLANS.starter.priceId,
    name: PLANS.starter.name,
    articles: PLANS.starter.articles,
    price: Math.round(PLANS.starter.priceUSD * 100),
    priceUSD: PLANS.starter.priceUSD,
    description: `${PLANS.starter.articles} artículos por mes`,
  },
  pro: {
    priceId: PLANS.pro.priceId,
    name: PLANS.pro.name,
    articles: PLANS.pro.articles,
    price: Math.round(PLANS.pro.priceUSD * 100),
    priceUSD: PLANS.pro.priceUSD,
    description: `${PLANS.pro.articles} artículos por mes`,
  },
  agency: {
    priceId: PLANS.agency.priceId,
    name: PLANS.agency.name,
    articles: PLANS.agency.articles,
    price: Math.round(PLANS.agency.priceUSD * 100),
    priceUSD: PLANS.agency.priceUSD,
    description: `${PLANS.agency.articles} artículos por mes`,
  },
};

export async function createCheckoutSession(
  userId: string,
  plan: keyof typeof SUBSCRIPTION_PLANS
): Promise<Stripe.Checkout.Session | null> {
  try {
    const planConfig = SUBSCRIPTION_PLANS[plan];

    // If Stripe Price ID is set, use subscription mode
    // Otherwise fall back to payment mode for backward compatibility
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: planConfig.priceId
        ? [
            {
              price: planConfig.priceId,
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: planConfig.name,
                  description: planConfig.description,
                },
                unit_amount: planConfig.price,
                recurring: {
                  interval: "month",
                  interval_count: 1,
                },
              },
              quantity: 1,
            },
          ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=canceled`,
      metadata: {
        userId,
        plan,
        articles: planConfig.articles.toString(),
      },
    });

    return session;
  } catch (error) {
    console.error("Error creando sesión de Stripe:", error);
    return null;
  }
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<{
  success: boolean;
  userId?: string;
  plan?: string;
  error?: string;
}> {
  try {
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan;

    if (!userId || !plan || !(plan in SUBSCRIPTION_PLANS)) {
      return { success: false, error: "Metadata inválida en subscripción" };
    }

    return {
      success: true,
      userId,
      plan,
    };
  } catch (error) {
    console.error("Error manejando suscripción creada:", error);
    return { success: false, error: "Error procesando suscripción" };
  }
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan;

    if (!userId || !plan) {
      return { success: false, error: "Metadata inválida" };
    }

    return { success: true, userId };
  } catch (error) {
    console.error("Error manejando suscripción actualizada:", error);
    return { success: false, error: "Error procesando suscripción" };
  }
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<boolean> {
  try {
    const userId = subscription.metadata?.userId;
    return !!userId;
  } catch (error) {
    console.error("Error manejando suscripción cancelada:", error);
    return false;
  }
}
