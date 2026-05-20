-- AlterTable
ALTER TABLE "users" ADD COLUMN "agencyName" TEXT,
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "stripeSubscriptionId" TEXT,
ADD COLUMN "subscriptionStatus" TEXT,
ADD COLUMN "subscriptionPlan" TEXT,
ADD COLUMN "articlesLimitPerMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "articlesUsedThisMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "billingCycleStart" TIMESTAMP(3),
ADD COLUMN "billingCycleEnd" TIMESTAMP(3);
