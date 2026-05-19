import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PRODUCTS = {
  starter: {
    credits: 10,
    price: 2900,
    priceUSD: 29,
    name: "Starter",
    description: "10 artículos SEO",
  },
  pro: {
    credits: 30,
    price: 6900,
    priceUSD: 69,
    name: "Growth",
    description: "30 artículos SEO",
  },
  agency: {
    credits: 100,
    price: 14900,
    priceUSD: 149,
    name: "Scale",
    description: "100 artículos SEO",
  },
};

export async function createCheckoutSession(
  userId: string,
  plan: keyof typeof STRIPE_PRODUCTS
): Promise<Stripe.Checkout.Session | null> {
  try {
    const product = STRIPE_PRODUCTS[plan];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${product.name} Plan - ${product.credits} créditos`,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?success=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?canceled=true`,
      metadata: {
        userId,
        plan,
        credits: product.credits.toString(),
      },
    });

    return session;
  } catch (error) {
    console.error("Error creando sesión de Stripe:", error);
    return null;
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<{
  success: boolean;
  userId?: string;
  credits?: number;
  error?: string;
}> {
  try {
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0");

    if (!userId || !credits) {
      return { success: false, error: "Metadata inválida en sesión" };
    }

    return {
      success: true,
      userId,
      credits,
    };
  } catch (error) {
    console.error("Error procesando sesión completada:", error);
    return { success: false, error: "Error procesando pago" };
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
