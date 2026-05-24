import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { generateArticleFn } from "@/inngest/functions/generate-article";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateArticleFn],
});
