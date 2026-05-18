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
  const [stats, setStats] = useState<UserStats>({
    credits: 0,
    articlesGenerated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/credits/check");
        if (response.ok) {
          const data = await response.json();
          setStats((prev) => ({
            ...prev,
            credits: data.data.credits,
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Créditos disponibles</p>
              <p className="text-4xl font-bold text-gray-900">
                {stats.credits}
              </p>
            </div>
            <div className="text-5xl">🎫</div>
          </div>
          <Link href="/credits" className="mt-4 block">
            <Button className="w-full">Comprar más créditos</Button>
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Generar contenido</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                Crea nuevos artículos SEO
              </p>
            </div>
            <div className="text-5xl">✍️</div>
          </div>
          <Link href="/generator" className="mt-4 block">
            <Button className="w-full">Ir al generador</Button>
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/generator">
            <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer">
              <p className="font-semibold text-blue-900">Generar artículos</p>
              <p className="text-sm text-blue-700 mt-1">
                Crea contenido SEO con IA
              </p>
            </div>
          </Link>

          <Link href="/history">
            <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition cursor-pointer">
              <p className="font-semibold text-green-900">Historial</p>
              <p className="text-sm text-green-700 mt-1">
                Ver todos tus artículos
              </p>
            </div>
          </Link>

          <Link href="/credits">
            <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition cursor-pointer">
              <p className="font-semibold text-purple-900">Créditos</p>
              <p className="text-sm text-purple-700 mt-1">
                Compra más artículos
              </p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}

