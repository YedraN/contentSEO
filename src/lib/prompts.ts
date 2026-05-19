export const SEO_ARTICLE_PROMPT = (
  companyName: string,
  companyType: string,
  keywords: string[],
  tone: string,
  language: string = "es",
  styleGuide?: string
) => {
  const languageLabel = LANGUAGE_OPTIONS.find(l => l.value === language)?.label ?? language;
  const styleSection = styleGuide
    ? `\n\nCRITICAL — You MUST emulate this author's voice EXACTLY. This is a style guide extracted from their own writing. Follow it precisely:

${styleGuide}

Every sentence must sound like this author wrote it. Match their vocabulary, rhythm, tone, and sentence structure. This is the most important instruction.`
    : "";

  return `You are an expert SEO content writer. Generate a professional, high-quality SEO article for a ${companyType} company called "${companyName}".

LANGUAGE: Write the ENTIRE article — title, meta description, headings, body, FAQ, and keywords — in ${languageLabel}. This is mandatory. Do not use any other language.

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
4. FAQ section (3-4 questions)${styleSection}

CRITICAL RULES:
- Respond ONLY with valid JSON, NO markdown, NO code blocks, NO extra text
- The "content" field contains HTML — put ALL the HTML on ONE SINGLE LINE
- Do NOT use any literal newlines anywhere in the JSON
- Escape double quotes inside strings as \"
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

export const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
  { value: "nl", label: "Nederlands" },
  { value: "pl", label: "Polski" },
] as const;

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
