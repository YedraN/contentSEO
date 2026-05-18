"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

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
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historial</h1>
          <p className="text-gray-500 mt-1">Tus artículos generados</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="shimmer-loading h-6 w-3/4 mb-3" />
              <div className="shimmer-loading h-4 w-1/2 mb-2" />
              <div className="shimmer-loading h-4 w-1/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Historial</h1>
        <p className="text-gray-500 mt-1">
          {articles.length > 0
            ? `${articles.length} artículo${articles.length > 1 ? "s" : ""} generado${articles.length > 1 ? "s" : ""}`
            : "Tus artículos generados"}
        </p>
      </div>

      {articles.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No tienes artículos aún</h3>
          <p className="text-sm text-gray-500 mb-6">Genera tu primer artículo SEO para verlo aquí</p>
          <Link href="/generator">
            <Button>Ir al generador</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article, i) => (
            <Card key={article.id} hover className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{article.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{article.companyName}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {article.keywords.slice(0, 4).map((kw, i) => (
                      <span key={i} className="bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {kw}
                      </span>
                    ))}
                    {article.keywords.length > 4 && (
                      <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-lg">
                        +{article.keywords.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm text-gray-900 font-medium">
                    {new Date(article.createdAt).toLocaleDateString("es-ES")}
                  </p>
                  {article.readingTime && (
                    <p className="text-xs text-gray-500 mt-0.5">{article.readingTime} min lectura</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
