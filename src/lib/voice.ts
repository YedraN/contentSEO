import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

export interface StyleGuide {
  styleGuide: string;
  sentenceLength: string;
  tone: string;
  vocabulary: string;
  distinctiveTraits: string[];
  keyInstructions: string[];
}

export async function analyzeWritingStyle(
  articles: string[]
): Promise<StyleGuide | null> {
  try {
    const content = articles
      .map(
        (a, i) =>
          `--- ARTÍCULO ${i + 1} ---\n${a.substring(0, 4000)}`
      )
      .join("\n\n");

    const prompt = `Eres un experto en análisis de estilo de escritura. Analiza los siguientes artículos escritos por el mismo autor y extrae un perfil de voz detallado.

Artículos:
${content}

Analiza en profundidad:
1. Longitud de oraciones (corta/media/larga, rango de palabras promedio)
2. Estructura de párrafos (extensión típica, número de oraciones)
3. Vocabulario (formal/técnico/conversacional, jerga específica)
4. Tono general (autoritario, amigable, académico, persuasivo, inspirador)
5. Recursos retóricos (preguntas retóricas, analogías, metáforas, datos, storytelling)
6. Formato (uso de listas, negritas, blockquotes, enlaces)
7. Patrones de transición (palabras y frases de transición favoritas)
8. Rasgos distintivos (qué hace único a este autor vs otros)
9. Posición/ángulo (primera persona, experto externo, marca corporativa)
10. Ganchos iniciales (cómo empieza típicamente los artículos)
11. Cómo maneja la conclusión (CTA, resumen, pregunta abierta)

Responde SOLO con JSON válido, sin markdown, sin bloques de código:

{
  "styleGuide": "Descripción narrativa y detallada en español de la voz del autor (2-3 párrafos)",
  "sentenceLength": "Descripción de la longitud típica de oraciones",
  "tone": "Descripción del tono principal con ejemplos",
  "vocabulary": "Descripción del nivel de vocabulario y estilo léxico",
  "distinctiveTraits": ["Rasgo 1", "Rasgo 2", "Rasgo 3", "Rasgo 4"],
  "keyInstructions": [
    "Instrucción concreta 1 para replicar el estilo",
    "Instrucción concreta 2 para replicar el estilo",
    "Instrucción concreta 3 para replicar el estilo",
    "Instrucción concreta 4 para replicar el estilo",
    "Instrucción concreta 5 para replicar el estilo"
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned) as StyleGuide;

    if (!parsed.styleGuide || !parsed.keyInstructions) {
      throw new Error("Respuesta incompleta");
    }

    return parsed;
  } catch (error) {
    console.error("Error analizando estilo de escritura:", error);
    return null;
  }
}
