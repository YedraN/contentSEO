"use client";

import GeneratorForm from "@/components/GeneratorForm";
import ArticlePreview from "@/components/ArticlePreview";
import { useState } from "react";
import { Article } from "@/types";

export default function GeneratorPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generar artículos</h1>
        <p className="text-gray-500 mt-1">Crea contenido SEO optimizado con IA</p>
      </div>

      <div className="max-w-2xl">
        <GeneratorForm onSuccess={(arts) => setArticles(arts)} />
      </div>

      {articles.length > 0 && (
        <div className="mt-10 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
            <span className="text-sm font-medium text-gray-500">
              {articles.length} artículo{articles.length > 1 ? "s" : ""} generado{articles.length > 1 ? "s" : ""}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>
          {articles.map((article) => (
            <ArticlePreview key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
