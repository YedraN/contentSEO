-- Add indexes to articles table
CREATE INDEX IF NOT EXISTS "articles_userId_createdAt_idx" ON "articles"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "articles_userId_clientId_idx" ON "articles"("userId", "clientId");
CREATE INDEX IF NOT EXISTS "articles_userId_publishedToWp_idx" ON "articles"("userId", "publishedToWp");

-- Add index to credit_purchases table
CREATE INDEX IF NOT EXISTS "credit_purchases_userId_createdAt_idx" ON "credit_purchases"("userId", "createdAt" DESC);

-- CreateTable: generation_jobs
CREATE TABLE "generation_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 1,
    "doneItems" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL,
    "resultIds" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "generation_jobs_userId_createdAt_idx" ON "generation_jobs"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "generation_jobs" ADD CONSTRAINT "generation_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
