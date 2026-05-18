import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateMarkdown, generateHTML, generateWordDocument } from "@/lib/exports";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    const format = new URL(request.url).searchParams.get("format") || "markdown";

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Artículo no encontrado" },
        { status: 404 }
      );
    }

    if (article.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    let content: string | Buffer;
    let contentType: string;
    let filename: string;

    const slug = article.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const articleData = {
      title: article.title,
      content: article.content,
      keywords: article.keywords,
      metaDescription: article.metaDescription || "",
      readingTime: article.readingTime || 5,
    };

    switch (format.toLowerCase()) {
      case "markdown":
      case "md":
        content = generateMarkdown(articleData);
        contentType = "text/markdown";
        filename = `${slug}.md`;
        break;

      case "html":
        content = generateHTML(articleData);
        contentType = "text/html";
        filename = `${slug}.html`;
        break;

      case "word":
      case "docx":
        content = await generateWordDocument(articleData);
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        filename = `${slug}.docx`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Formato no soportado" },
          { status: 400 }
        );
    }

    await prisma.article.update({
      where: { id: params.id },
      data: { downloadedAt: new Date() },
    });

    return new NextResponse(content as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error descargando artículo:", error);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
