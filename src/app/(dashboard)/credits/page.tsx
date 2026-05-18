"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const PLANS = [
  { id: "starter", name: "Starter", credits: 3, price: 9 },
  { id: "pro", name: "Pro", credits: 10, price: 29 },
  { id: "agency", name: "Agency", credits: 50, price: 99 },
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
    <div>
      <h1 className="text-3xl font-bold mb-2">Comprar créditos</h1>
      <p className="text-gray-600 mb-8">
        Elige el plan que mejor se adapte a tus necesidades
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              ${plan.price}
            </p>
            <p className="text-gray-600 mb-6">{plan.credits} créditos</p>
            <div className="mt-auto">
              <Button
                onClick={() => handlePurchase(plan.id)}
                disabled={loading === plan.id}
                className="w-full"
              >
                {loading === plan.id ? "Procesando..." : "Comprar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
