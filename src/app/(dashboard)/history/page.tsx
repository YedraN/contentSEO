"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

interface ArticleSummary {
  id: string;
  title: string;
  keywords: string[];
  companyName: string;
  readingTime: number | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles/list");
        const data = await res.json();
        if (data.success) {
          setArticles(data.data.articles);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  if (articles.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Historial</h1>
        <Card>
          <p className="text-gray-500 text-center py-8">
            No tienes artículos generados aún.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Historial</h1>
      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <h2 className="text-lg font-bold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{article.companyName}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {article.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {new Date(article.createdAt).toLocaleDateString()}
              {article.readingTime && ` · ${article.readingTime} min lectura`}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
