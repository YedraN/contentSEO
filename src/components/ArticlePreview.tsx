"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { classNames } from "@/lib/utils";

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
  const [showContent, setShowContent] = useState(false);

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
    <Card className="animate-fade-in-up overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">{article.title}</h2>
        {article.metaDescription && (
          <p className="text-gray-500 italic mb-4 border-l-4 border-brand-500 pl-4">
            {article.metaDescription}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.keywords?.map((keyword) => (
            <span key={keyword} className="bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-lg">
              {keyword}
            </span>
          ))}
        </div>
        {article.readingTime && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readingTime} minutos de lectura
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            Formato de descarga
          </label>
          <div className="flex gap-1.5">
            {(["markdown", "html", "docx"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={classNames(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                  format === f
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {f === "markdown" ? ".md" : f === "html" ? ".html" : ".docx"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleDownload} isLoading={isDownloading} className="flex-1 sm:flex-none">
            Descargar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowContent(!showContent)}
            className="flex-1 sm:flex-none"
          >
            {showContent ? "Ocultar" : "Vista previa"}
          </Button>
        </div>
      </div>

      {showContent && (
        <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-xl p-6 max-h-[500px] overflow-y-auto prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      )}
    </Card>
  );
}
