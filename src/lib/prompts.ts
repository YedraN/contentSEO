export const SEO_ARTICLE_PROMPT = (
  companyName: string,
  companyType: string,
  keywords: string[],
  tone: string
) => {
  return `You are an expert SEO content writer. Generate a professional, high-quality SEO article for a ${companyType} company called "${companyName}".

IMPORTANT KEYWORDS TO INCLUDE NATURALLY: ${keywords.join(", ")}

Requirements:
- Length: 2000-2500 words
- Include H2 and H3 headers (at least 5 headers)
- Professional tone: ${tone}
- Highly optimized for SEO
- Include internal linking suggestions in brackets [link: topic]
- Natural keyword placement (avoid keyword stuffing)
- Include a compelling meta description (max 160 characters)
- Include a list of 5-8 most important keywords

Article Structure:
1. Introduction (150-200 words)
2. 3-4 main sections with subsections (H2s and H3s)
3. Conclusion (100-150 words)
4. FAQ section (3-4 questions)

CRITICAL RULES:
- Respond ONLY with valid JSON, NO markdown, NO code blocks, NO extra text
- Escape all special characters in strings (use \\n for newlines, \\" for quotes)
- Do NOT use literal newlines inside JSON strings
- The "content" field must be valid HTML with all special characters escaped
- Structure:
{
  "title": "Article title",
  "metaDescription": "Meta description under 160 chars",
  "content": "Full article content in HTML format (escape all special chars)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "readingTime": number (in minutes),
  "slug": "url-friendly-slug"
}`;
};

export const CONTENT_TONE_OPTIONS = [
  "professional",
  "casual",
  "technical",
  "friendly",
] as const;

export const COMPANY_TYPES = [
  "E-commerce",
  "SaaS",
  "Agencia de marketing",
  "Consultoría",
  "Servicios profesionales",
  "Educación",
  "Salud",
  "Viajes",
  "Finanzas",
  "Tecnología",
  "Otro",
];
