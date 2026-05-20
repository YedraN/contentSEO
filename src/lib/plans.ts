export const PLAN_FEATURES = {
  starter: {
    articlesPerMonth: 20,
    wordpress: false,
    multiClient: false,
    voiceProfiles: true,
  },
  pro: {
    articlesPerMonth: 80,
    wordpress: true,
    multiClient: true,
    voiceProfiles: true,
  },
  agency: {
    articlesPerMonth: 250,
    wordpress: true,
    multiClient: true,
    voiceProfiles: true,
  },
  trial: {
    articlesPerMonth: 1,
    wordpress: false,
    multiClient: false,
    voiceProfiles: false,
  },
} as const;

export function getPlanFeatures(plan: string | null | undefined) {
  if (!plan || !(plan in PLAN_FEATURES)) {
    return PLAN_FEATURES.trial;
  }
  return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES];
}

export function hasFeature(plan: string | null | undefined, feature: keyof typeof PLAN_FEATURES.pro): boolean {
  const features = getPlanFeatures(plan);
  return (features as any)[feature] ?? false;
}
