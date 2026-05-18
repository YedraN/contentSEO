import Anthropic from "@anthropic-ai/sdk";
import { GeneratedArticle } from "@/types";
import { SEO_ARTICLE_PROMPT } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateArticle(
  companyName: string,
  companyType: string,
  keywords: string[],
  tone: "professional" | "casual" | "technical" | "friendly" = "professional"
): Promise<GeneratedArticle | null> {
  try {
    const prompt = SEO_ARTICLE_PROMPT(companyName, companyType, keywords, tone);

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const article = JSON.parse(cleanedText) as GeneratedArticle;

    if (!article.title || !article.content) {
      throw new Error("Respuesta incompleta de Claude");
    }

    return article;
  } catch (error) {
    console.error("Error generando artículo con Claude:", error);
    return null;
  }
}

export async function generateMultipleArticles(
  companyName: string,
  companyType: string,
  keywords: string[],
  tone: "professional" | "casual" | "technical" | "friendly" = "professional",
  numArticles: number = 1
): Promise<GeneratedArticle[]> {
  const articles: GeneratedArticle[] = [];

  for (let i = 0; i < numArticles; i++) {
    const variedKeywords = i > 0 ? rotateArray(keywords, i) : keywords;

    const article = await generateArticle(
      companyName,
      companyType,
      variedKeywords,
      tone
    );

    if (article) {
      articles.push(article);
    } else {
      console.warn(`Error generando artículo ${i + 1}`);
    }

    if (i < numArticles - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return articles;
}

function rotateArray<T>(array: T[], times: number): T[] {
  const rotated = [...array];
  for (let i = 0; i < times; i++) {
    const first = rotated.shift();
    if (first) rotated.push(first);
  }
  return rotated;
}

export async function optimizeForSEO(
  title: string,
  content: string
): Promise<{ optimizedTitle: string; keywords: string[] }> {
  try {
    const prompt = `Analiza este contenido y sugiere:
1. Un título más optimizado para SEO
2. 5-7 palabras clave principales

Título actual: "${title}"
Contenido: "${content.substring(0, 1000)}..."

Responde SOLO con JSON válido:
{
  "optimizedTitle": "nuevo título",
  "keywords": ["keyword1", "keyword2"]
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const result = JSON.parse(cleanedText);
    return result;
  } catch (error) {
    console.error("Error optimizando para SEO:", error);
    return { optimizedTitle: title, keywords: [] };
  }
}
