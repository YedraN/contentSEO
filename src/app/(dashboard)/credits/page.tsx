"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { classNames } from "@/lib/utils";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: 29,
    pricePerCredit: 2.9,
    description: "Para agencias que quieren probar el servicio",
    features: [
      "10 artículos SEO de 2.000+ palabras",
      "8 idiomas disponibles",
      "Exportación .md, .html, .docx",
      "Sin fecha de caducidad",
    ],
    popular: false,
    color: "text-gray-600",
  },
  {
    id: "pro",
    name: "Growth",
    credits: 30,
    price: 69,
    pricePerCredit: 2.3,
    description: "El más elegido por agencias en crecimiento",
    features: [
      "30 artículos SEO de 2.000+ palabras",
      "8 idiomas disponibles",
      "Exportación .md, .html, .docx",
      "Sin fecha de caducidad",
      "Soporte prioritario",
    ],
    popular: true,
    color: "text-brand-600",
  },
  {
    id: "agency",
    name: "Scale",
    credits: 100,
    price: 149,
    pricePerCredit: 1.49,
    description: "Para agencias con alta producción de contenido",
    features: [
      "100 artículos SEO de 2.000+ palabras",
      "8 idiomas disponibles",
      "Exportación .md, .html, .docx",
      "Sin fecha de caducidad",
      "Soporte prioritario",
      "Acceso anticipado a nuevas funciones",
    ],
    popular: false,
    color: "text-gray-600",
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

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
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Recarga artículos</h1>
        <p className="text-gray-500 mt-1">Paga solo por lo que necesitas — sin mensualidades ni compromisos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={classNames(
              "relative rounded-2xl p-6 border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col",
              plan.popular
                ? "border-brand-500 shadow-lg shadow-brand-500/10"
                : "border-gray-100 shadow-sm"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-sm whitespace-nowrap">
                Más popular
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
            </div>

            <div className="mb-1">
              <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-400 text-sm ml-1">/ pago único</span>
            </div>
            <p className={classNames("text-sm font-semibold mb-5", plan.color)}>
              {plan.credits} artículos · ${plan.pricePerCredit.toFixed(2)} c/u
            </p>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handlePurchase(plan.id)}
              disabled={loading === plan.id}
              isLoading={loading === plan.id}
              variant={plan.popular ? "primary" : "outline"}
              className="w-full"
            >
              {loading === plan.id ? "Procesando..." : `Comprar ${plan.credits} artículos`}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-5xl p-6 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">¿Necesitas un volumen mayor?</p>
          <p className="text-sm text-gray-500 mt-0.5">Contacta con nosotros para un plan personalizado para tu agencia</p>
        </div>
        <a
          href="mailto:hola@contentseo.io"
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-900 text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-200 whitespace-nowrap"
        >
          Hablar con ventas
        </a>
      </div>
    </div>
  );
}
