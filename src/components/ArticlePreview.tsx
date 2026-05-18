"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ArticlePreviewProps {
  article: {
    id: string;
    title: string;
    content: string;
    keywords: string[];
    metaDescription?: string;
    readingTime?: number;
  };
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [format, setFormat] = useState<"markdown" | "html" | "docx">("markdown");

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(`/api/articles/download/${article.id}?format=${format}`);

      if (!response.ok) {
        toast.error("Error descargando artículo");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const ext = format === "docx" ? "docx" : format === "html" ? "html" : "md";
      const filename = `${article.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}.${ext}`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Artículo descargado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error descargando artículo");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
        {article.metaDescription && (
          <p className="text-gray-600 italic mb-4">{article.metaDescription}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.keywords?.map((keyword) => (
            <span key={keyword} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {keyword}
            </span>
          ))}
        </div>
        {article.readingTime && (
          <p className="text-sm text-gray-500">Tiempo de lectura: {article.readingTime} minutos</p>
        )}
      </div>

      <div className="border-t pt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Formato de descarga:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "markdown" | "html" | "docx")}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="markdown">Markdown (.md)</option>
            <option value="html">HTML (.html)</option>
            <option value="docx">Word (.docx)</option>
          </select>
        </div>
        <Button onClick={handleDownload} isLoading={isDownloading} className="w-full">
          {isDownloading ? "Descargando..." : `Descargar como ${format.toUpperCase()}`}
        </Button>
      </div>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4">Previa del contenido</h3>
        <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>
    </Card>
  );
}
