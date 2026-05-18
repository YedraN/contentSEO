"use client";

import { useEffect, useState } from "react";
import GeneratorForm from "@/components/GeneratorForm";
import ArticlePreview from "@/components/ArticlePreview";
import Link from "next/link";
import { Article } from "@/types";

export default function GeneratorPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/credits/check")
      .then((r) => r.json())
      .then((d) => { if (d.data?.credits !== undefined) setCredits(d.data.credits); })
      .catch(() => {});
  }, []);

  const handleSuccess = (arts: Article[]) => {
    setArticles(arts);
    if (credits !== null) setCredits((c) => Math.max(0, (c ?? 0) - arts.length));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Generar artículos</h1>
          <p className="text-gray-500 mt-1 text-sm">Configura el cliente, las keywords y listo</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5 self-start">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-700">
            {credits === null ? "—" : credits} crédito{credits !== 1 ? "s" : ""} disponible{credits !== 1 ? "s" : ""}
          </span>
          {credits !== null && credits < 5 && (
            <Link href="/credits" className="text-xs text-brand-600 font-semibold hover:underline ml-1">
              Recargar
            </Link>
          )}
        </div>
      </div>

      {credits === 0 ? (
        /* Sin créditos */
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Sin créditos disponibles</h3>
          <p className="text-gray-500 text-sm mb-6">Recarga tu plan para seguir generando artículos para tus clientes.</p>
          <Link href="/credits">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
              Ver planes
            </button>
          </Link>
        </div>
      ) : (
        /* Layout dos columnas en desktop */
        <div className={`grid gap-8 ${articles.length > 0 ? "lg:grid-cols-2" : ""}`}>
          {/* Formulario */}
          <div className={articles.length > 0 ? "" : "max-w-2xl"}>
            <GeneratorForm onSuccess={handleSuccess} />
          </div>

          {/* Resultados */}
          {articles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">
                  {articles.length} artículo{articles.length > 1 ? "s" : ""} generado{articles.length > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setArticles([])}
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Limpiar
                </button>
              </div>
              {articles.map((article) => (
                <ArticlePreview key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
