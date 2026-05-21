export const PLANS = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_STARTER_ID || "",
    priceUSD: 49,
    articles: 20,
    description: "Perfecto para freelancers",
    features: {
      articlesPerMonth: 20,
      wordpress: false,
      multiClient: false,
      voiceProfiles: true,
    },
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_PRO_ID || "",
    priceUSD: 149,
    articles: 80,
    description: "La opción más elegida",
    features: {
      articlesPerMonth: 80,
      wordpress: true,
      multiClient: true,
      voiceProfiles: true,
    },
  },
  agency: {
    name: "Agency",
    priceId: process.env.STRIPE_PRICE_AGENCY_ID || "",
    priceUSD: 399,
    articles: 250,
    description: "Para grandes volúmenes",
    features: {
      articlesPerMonth: 250,
      wordpress: true,
      multiClient: true,
      voiceProfiles: true,
    },
  },
  trial: {
    name: "Trial",
    priceId: "",
    priceUSD: 0,
    articles: 1,
    description: "Plan de prueba",
    features: {
      articlesPerMonth: 1,
      wordpress: false,
      multiClient: false,
      voiceProfiles: false,
    },
  },
} as const;

export function getPlanFeatures(plan: string | null | undefined) {
  if (!plan || !(plan in PLANS)) {
    return PLANS.trial.features;
  }
  return PLANS[plan as keyof typeof PLANS].features;
}

export function hasFeature(plan: string | null | undefined, feature: "wordpress" | "multiClient" | "voiceProfiles"): boolean {
  const features = getPlanFeatures(plan);
  return (features as any)[feature] ?? false;
}
