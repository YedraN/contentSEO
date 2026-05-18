"use client";

import GeneratorForm from "@/components/GeneratorForm";
import ArticlePreview from "@/components/ArticlePreview";
import { useState } from "react";
import { Article } from "@/types";

export default function GeneratorPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Generar artículos</h1>
      <GeneratorForm onSuccess={(arts) => setArticles(arts)} />
      {articles.length > 0 && (
        <div className="mt-8 space-y-6">
          {articles.map((article) => (
            <ArticlePreview key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
