"use client";

import { useEffect, useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";

interface ClientInfo {
  id: string;
  name: string;
}

interface ArticleSummary {
  id: string;
  title: string;
  keywords: string[];
  companyName: string;
  readingTime: number | null;
  createdAt: string;
  client?: { name: string } | null;
  clientId?: string | null;
}

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [clientFilter, setClientFilter] = useState("");

  const fetchArticles = useCallback(async (p: number, q: string, clientId: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (q) params.set("search", q);
      if (clientId) params.set("clientId", clientId);
      const res = await fetch(`/api/articles/list?${params}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data.articles);
        setTotal(data.data.pagination?.total ?? data.data.articles.length);
      }
    } catch {
      toast.error("Error cargando artículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(page, query, clientFilter); }, [page, query, clientFilter, fetchArticles]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((d) => { if (d.success) setClients(d.data); })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const handleDownload = async (id: string, title: string, format: "markdown" | "html" | "docx") => {
    setDownloading(id);
    try {
      const res = await fetch(`/api/articles/download/${id}?format=${format}`);
      if (!res.ok) { toast.error("Error al descargar"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = format === "docx" ? "docx" : format === "html" ? "html" : "md";
      a.download = `${title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Descargado");
    } catch {
      toast.error("Error al descargar");
    } finally {
      setDownloading(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="animate-fade-in space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Historial</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {loading ? "Cargando…" : `${total} artículo${total !== 1 ? "s" : ""} generado${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/generator">
          <Button size="sm" className="shrink-0">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo artículo
          </Button>
        </Link>
      </div>

      {/* Búsqueda + Filtro cliente */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o cliente…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Buscar</Button>
          {query && (
            <Button type="button" variant="ghost" size="sm" onClick={() => { setSearch(""); setQuery(""); setPage(1); }}>
              Limpiar
            </Button>
          )}
        </form>

        {clients.length > 0 && (
          <select
            value={clientFilter}
            onChange={(e) => { setClientFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all"
          >
            <option value="">Todos los clientes</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-gray-50 last:border-0 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-8 w-24 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {query || clientFilter ? "Sin resultados" : "No tienes artículos aún"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {query || clientFilter ? "Prueba con otros filtros." : "Genera tu primer artículo SEO para verlo aquí."}
          </p>
          {!query && !clientFilter && (
            <Link href="/generator"><Button>Ir al generador</Button></Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {articles.map((article) => (
              <li key={article.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 leading-snug">{article.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {article.client?.name && (
                        <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">{article.client.name}</span>
                      )}
                      {article.companyName && !article.client?.name && (
                        <span className="text-xs text-gray-500 font-medium">{article.companyName}</span>
                      )}
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        {new Date(article.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {article.readingTime && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{article.readingTime} min</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {article.keywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                          {kw}
                        </span>
                      ))}
                      {article.keywords.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                          +{article.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      {(["markdown", "html", "docx"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleDownload(article.id, article.title, fmt)}
                          disabled={downloading === article.id}
                          className="px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-white hover:text-brand-600 hover:shadow-sm rounded-md transition-all disabled:opacity-50"
                          title={`Descargar .${fmt === "markdown" ? "md" : fmt}`}
                        >
                          {fmt === "markdown" ? ".md" : fmt === "html" ? ".html" : ".docx"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              ← Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
              Siguiente →
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
