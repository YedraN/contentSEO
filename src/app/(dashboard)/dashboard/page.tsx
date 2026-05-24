'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { parseKeywords } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Article {
  id: string;
  title: string;
  keywords: string[];
  createdAt: string;
}

interface Stats {
  credits: number;
  articlesTotal: number;
}

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  agency: "Agency",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ credits: 0, articlesTotal: 0 });
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derive display name from user context (no more localStorage)
  const displayName =
    user?.agencyName || user?.name || "Tu agencia";

  const plan = user?.subscriptionPlan;
  const planLabel = plan ? PLAN_LABELS[plan] ?? plan : null;
  const hasActivePlan = !!plan && user?.subscriptionStatus === "active";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsRes, articlesRes] = await Promise.all([
          fetch("/api/credits/check"),
          fetch("/api/articles/list?page=1&limit=5"),
        ]);

        if (creditsRes.ok) {
          const d = await creditsRes.json();
          setStats((prev) => ({ ...prev, credits: d.data?.credits ?? 0 }));
        }

        if (articlesRes.ok) {
          const d = await articlesRes.json();
          const list: Article[] = d.data?.articles ?? [];
          setArticles(list);
          setStats((prev) => ({ ...prev, articlesTotal: d.data?.total ?? list.length }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{greeting()}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {displayName}
          </h1>
        </div>
        <Link href="/generator">
          <Button size="lg" className="shrink-0">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Generar artículos
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Créditos disponibles",
            value: isLoading ? "—" : stats.credits.toString(),
            sub: "artículos restantes",
            accent: "from-brand-500 to-brand-600",
            action: { href: "/credits", label: "Recargar" },
          },
          {
            label: "Artículos generados",
            value: isLoading ? "—" : stats.articlesTotal.toString(),
            sub: "en total",
            accent: "from-purple-500 to-purple-600",
            action: { href: "/history", label: "Ver todos" },
          },
          {
            label: "Plan activo",
            value: hasActivePlan ? planLabel! : "Sin plan",
            sub: hasActivePlan
              ? `${stats.credits} crédito${stats.credits !== 1 ? "s" : ""} disponible${stats.credits !== 1 ? "s" : ""}`
              : "Recarga para empezar",
            accent: hasActivePlan
              ? "from-emerald-500 to-emerald-600"
              : "from-gray-400 to-gray-500",
            action: { href: "/credits", label: hasActivePlan ? "Ver plan" : "Ver planes" },
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.accent} opacity-90`} />
            </div>
            <Link href={card.action.href} className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              {card.action.label} →
            </Link>
          </div>
        ))}
      </div>

      {!isLoading && articles.length === 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100 p-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Genera tu primer artículo</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Elige un cliente, añade las keywords y tendrás un artículo SEO listo en 30 segundos.
          </p>
          <Link href="/generator">
            <Button size="lg">Empezar ahora</Button>
          </Link>
        </div>
      )}

      {!isLoading && articles.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Artículos recientes</h2>
            <Link href="/history" className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Ver todos →
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {articles.map((article) => (
              <li key={article.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    </span>
                    {parseKeywords(article.keywords)?.slice(0, 2).map((kw: string, i: number) => (
                      <span key={i} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/articles/${article.id}`} className="ml-4 shrink-0">
                  <Button variant="ghost" size="sm">Ver</Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded flex-1" />
              <div className="h-4 bg-gray-100 rounded w-20" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
