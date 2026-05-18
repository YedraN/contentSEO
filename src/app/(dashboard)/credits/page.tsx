"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { classNames } from "@/lib/utils";

const PLANS = [
  { id: "starter", name: "Starter", credits: 3, price: 9, pricePerCredit: 3, description: "Perfecto para probar", popular: false },
  { id: "pro", name: "Pro", credits: 10, price: 29, pricePerCredit: 2.9, description: "Para creadores de contenido", popular: true },
  { id: "agency", name: "Agency", credits: 50, price: 99, pricePerCredit: 1.98, description: "Para agencias y equipos", popular: false },
];

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Planes de créditos</h1>
        <p className="text-gray-500 mt-2">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={classNames(
              "relative rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
              plan.popular
                ? "border-brand-500 bg-white shadow-lg shadow-brand-500/10"
                : "border-gray-100 bg-white"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                Más popular
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
            </div>

            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-400 text-sm ml-1">/ único</span>
            </div>

            <div className="text-center mb-2">
              <p className="text-3xl font-bold text-brand-600">{plan.credits}</p>
              <p className="text-sm text-gray-500">artículos</p>
            </div>

            <p className="text-center text-xs text-gray-400 mb-8">
              ${plan.pricePerCredit.toFixed(2)} por artículo
            </p>

            <Button
              onClick={() => handlePurchase(plan.id)}
              disabled={loading === plan.id}
              variant={plan.popular ? "primary" : "outline"}
              className="w-full"
            >
              {loading === plan.id ? "Procesando..." : `Comprar ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
