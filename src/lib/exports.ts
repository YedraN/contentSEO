import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { GeneratedArticle } from "@/types";

export function generateMarkdown(article: GeneratedArticle): string {
  const lines: string[] = [];

  lines.push("---");
  lines.push(`title: "${article.title}"`);
  lines.push(`description: "${article.metaDescription}"`);
  lines.push(`keywords: [${article.keywords.map((k) => `"${k}"`).join(", ")}]`);
  lines.push(`readingTime: ${article.readingTime} minutos`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${article.title}`);
  lines.push("");
  lines.push(`> ${article.metaDescription}`);
  lines.push("");

  const content = htmlToMarkdown(article.content);
  lines.push(content);

  lines.push("");
  lines.push("---");
  lines.push(`_Artículo generado automáticamente el ${new Date().toLocaleDateString()}_`);

  return lines.join("\n");
}

export function generateHTML(article: GeneratedArticle): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${article.metaDescription}">
  <meta name="keywords" content="${article.keywords.join(", ")}">
  <title>${article.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { font-size: 2.5em; margin-bottom: 20px; color: #1a1a1a; border-bottom: 3px solid #007bff; padding-bottom: 15px; }
    h2 { font-size: 1.8em; margin-top: 30px; margin-bottom: 15px; color: #222; }
    h3 { font-size: 1.3em; margin-top: 20px; margin-bottom: 10px; color: #444; }
    p { margin-bottom: 15px; text-align: justify; }
    .meta { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 30px; font-size: 0.9em; color: #666; }
    .keywords span { display: inline-block; background: #e8f1ff; color: #0066cc; padding: 3px 8px; border-radius: 3px; margin: 3px 3px 3px 0; font-size: 0.85em; }
    ul, ol { margin: 15px 0 15px 30px; }
    li { margin-bottom: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.85em; color: #999; }
    @media (max-width: 600px) { .container { padding: 20px; } h1 { font-size: 1.8em; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>${article.title}</h1>
    <div class="meta">
      <p>${article.metaDescription}</p>
      <div class="keywords">
        <strong>Palabras clave:</strong>
        ${article.keywords.map((k) => `<span>${k}</span>`).join("")}
      </div>
      <p><strong>Tiempo de lectura:</strong> ${article.readingTime} minutos</p>
    </div>
    <div class="content">${article.content}</div>
    <div class="footer">
      <p>Artículo generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}</p>
    </div>
  </div>
</body>
</html>`;
}

export async function generateWordDocument(
  article: GeneratedArticle
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: article.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200, before: 0 },
          }),
          new Paragraph({
            children: [new TextRun({ text: article.metaDescription, italics: true })],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Palabras clave: ${article.keywords.join(", ")}`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Tiempo de lectura: ${article.readingTime} minutos`,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: htmlToPlainText(article.content),
            spacing: { line: 360, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generado el ${new Date().toLocaleDateString("es-ES")}`,
                italics: true,
                size: 18,
                color: "999999",
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function htmlToMarkdown(html: string): string {
  let markdown = html;

  markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/g, (_match, level, content) => {
    return `${"#".repeat(Number(level))} ${content}\n`;
  });
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/g, "$1\n\n");
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/g, "**$1**");
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, "_$1_");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/g, "_$1_");
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (_match, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/g, "- $1\n");
  });
  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_match, content) => {
    let counter = 1;
    return content.replace(/<li[^>]*>(.*?)<\/li>/g, (_m: string, item: string) => `${counter++}. ${item}\n`);
  });
  markdown = markdown.replace(/<[^>]+>/g, "");
  markdown = markdown.replace(/\n{3,}/g, "\n\n");

  return markdown.trim();
}

function htmlToPlainText(html: string): string {
  let text = html;
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}
