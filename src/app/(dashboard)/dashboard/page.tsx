"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface UserStats {
  credits: number;
  articlesGenerated: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats>({ credits: 0, articlesGenerated: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/credits/check");
        if (response.ok) {
          const data = await response.json();
          setStats((prev) => ({ ...prev, credits: data.data.credits }));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Créditos disponibles",
      value: isLoading ? "-" : stats.credits.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-brand-500 to-brand-600",
      link: "/credits",
      linkText: "Comprar créditos",
    },
    {
      label: "Generar contenido",
      value: "Nuevo artículo",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      link: "/generator",
      linkText: "Ir al generador",
    },
  ];

  const quickLinks = [
    { href: "/generator", label: "Generar artículos", desc: "Crea contenido SEO con IA", color: "bg-brand-50 text-brand-700 hover:bg-brand-100" },
    { href: "/history", label: "Historial", desc: "Ver todos tus artículos", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
    { href: "/credits", label: "Créditos", desc: "Compra más artículos", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido a tu panel de control</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statCards.map((card, i) => (
          <Card key={i} hover gradient>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {card.icon}
              </div>
            </div>
            <Link href={card.link}>
              <Button variant="secondary" size="sm" className="w-full">
                {card.linkText}
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`p-4 rounded-xl ${link.color} transition-all duration-200 cursor-pointer`}>
                <p className="font-semibold">{link.label}</p>
                <p className="text-sm opacity-80 mt-1">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
