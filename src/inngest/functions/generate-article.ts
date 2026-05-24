import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/db";
import { refundCredits } from "@/lib/auth";
import { generateArticle } from "@/lib/groq";

export interface GenerateArticleEventData {
  jobId: string;
  userId: string;
  usedSubscription: boolean;
  articlesToCharge: number;
  payload: {
    companyName: string;
    companyType: string;
    keywords: string[];
    tone: "professional" | "casual" | "technical" | "friendly";
    numArticles: number;
    language: string;
    voiceProfileId?: string;
    clientId?: string;
    styleGuide?: string;
  };
}

// ─── Main generation function ────────────────────────────────────────────────
export const generateArticleFn = inngest.createFunction(
  {
    id: "generate-article",
    retries: 2,
    // Limit concurrency per user so a single user can't flood Groq
    concurrency: {
      limit: 2,
      key: "event.data.userId",
    },
    triggers: [{ event: "article/generate.requested" }],
    // Called when all retries are exhausted
    onFailure: async ({ event, step, error }) => {
      const originalData = event.data.event?.data as GenerateArticleEventData | undefined;
      if (!originalData) return;

      const { jobId, userId, usedSubscription, articlesToCharge } = originalData;

      await step.run("refund-credits-on-failure", async () => {
        await refundCredits(userId, articlesToCharge, usedSubscription);
      });

      await step.run("mark-job-failed", async () => {
        await prisma.generationJob.update({
          where: { id: jobId },
          data: {
            status: "failed",
            error: error?.message ?? "Error desconocido en la generación",
          },
        });
      });
    },
  },
  async ({ event, step }) => {
    const { jobId, userId, payload } = event.data as GenerateArticleEventData;
    const {
      companyName,
      companyType,
      keywords,
      tone,
      numArticles,
      language,
      voiceProfileId,
      clientId,
      styleGuide,
    } = payload;

    // Step 1: Mark job as running
    await step.run("start-job", async () => {
      await prisma.generationJob.update({
        where: { id: jobId },
        data: { status: "running" },
      });
    });

    // Steps 2…N+1: Generate each article independently so Inngest can retry
    // individual failed articles without re-running completed ones.
    const generatedArticles: Array<{
      title: string;
      content: string;
      metaDescription: string;
      readingTime: number;
      keywords: string[];
      index: number;
    }> = [];

    for (let i = 0; i < numArticles; i++) {
      const result = await step.run(`generate-article-${i}`, async () => {
        // Rotate keywords slightly so multiple articles on the same topic differ
        const rotated =
          i > 0
            ? [...keywords.slice(i % keywords.length), ...keywords.slice(0, i % keywords.length)]
            : keywords;

        const article = await generateArticle(
          companyName,
          companyType,
          rotated,
          tone,
          language,
          styleGuide
        );

        if (!article) {
          throw new Error(`Groq no devolvió contenido para el artículo ${i + 1}`);
        }

        return { ...article, index: i };
      });

      generatedArticles.push(result);

      // Update progress after each article
      await step.run(`update-progress-${i}`, async () => {
        const doneItems = i + 1;
        const progress = Math.round((doneItems / numArticles) * 90); // last 10% reserved for save step
        await prisma.generationJob.update({
          where: { id: jobId },
          data: { doneItems, progress },
        });
      });
    }

    // Step N+2: Save all articles to DB
    const savedIds = await step.run("save-articles", async () => {
      const saved = await Promise.all(
        generatedArticles.map((article) =>
          prisma.article.create({
            data: {
              userId,
              title: article.title,
              content: article.content,
              keywords: JSON.stringify(article.keywords),
              companyName,
              companyType,
              metaDescription: article.metaDescription,
              readingTime: article.readingTime,
              ...(clientId ? { clientId } : {}),
              ...(voiceProfileId ? { voiceProfileId } : {}),
            },
            select: { id: true },
          })
        )
      );
      return saved.map((a) => a.id);
    });

    // Step N+3: Mark job as completed
    await step.run("complete-job", async () => {
      await prisma.generationJob.update({
        where: { id: jobId },
        data: {
          status: "completed",
          progress: 100,
          doneItems: generatedArticles.length,
          resultIds: savedIds,
        },
      });
    });

    return { jobId, articleIds: savedIds, count: savedIds.length };
  }
);
