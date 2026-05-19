-- AlterTable
ALTER TABLE "users" ADD COLUMN "wordpressUrl" TEXT,
ADD COLUMN "wordpressUsername" TEXT,
ADD COLUMN "wordpressPassword" TEXT,
ADD COLUMN "wordpressConnected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN "wordpressPostId" INTEGER,
ADD COLUMN "wordpressPostUrl" TEXT,
ADD COLUMN "publishedToWp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "publishedToWpAt" TIMESTAMP(3);
