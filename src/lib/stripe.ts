import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const SUBSCRIPTION_PLANS = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER_ID || "",
    name: "Starter",
    articles: 20,
    price: 4900, // $49/mes en centavos
    priceUSD: 49,
    description: "20 artículos por mes",
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO_ID || "",
    name: "Pro",
    articles: 80,
    price: 14900, // $149/mes
    priceUSD: 149,
    description: "80 artículos por mes",
  },
  agency: {
    priceId: process.env.STRIPE_PRICE_AGENCY_ID || "",
    name: "Agency",
    articles: 250,
    price: 39900, // $399/mes
    priceUSD: 399,
    description: "250 artículos por mes",
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
    console.error("Error procesando subscripción creada:", error);
    return { success: false, error: "Error procesando subscripción" };
  }
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<{
  success: boolean;
  userId?: string;
  status?: string;
  error?: string;
}> {
  try {
    const userId = subscription.metadata?.userId;
    const status = subscription.status;

    if (!userId) {
      return { success: false, error: "Usuario no encontrado en metadata" };
    }

    return {
      success: true,
      userId,
      status,
    };
  } catch (error) {
    console.error("Error procesando actualización de subscripción:", error);
    return { success: false, error: "Error procesando actualización" };
  }
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    return event;
  } catch (error) {
    console.error("Error verificando firma de webhook:", error);
    return null;
  }
}
