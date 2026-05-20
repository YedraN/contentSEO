"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { classNames } from "@/lib/utils";
import toast from "react-hot-toast";

const SUBSCRIPTION_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    articles: 20,
    description: "Perfecto para freelancers",
    popular: false,
    features: [
      "20 artículos al mes",
      "Exportación a MD, HTML, DOCX",
      "Plantillas por industria",
      "Soporte por email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    articles: 80,
    description: "La opción más elegida",
    popular: true,
    features: [
      "80 artículos al mes",
      "White-label completo",
      "Gestión multi-cliente",
      "WordPress en 1 clic",
      "Plantillas por industria",
      "Soporte prioritario",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: 399,
    articles: 250,
    description: "Para grandes volúmenes",
    popular: false,
    features: [
      "250 artículos al mes",
      "White-label + dominio",
      "Multi-cliente ilimitado",
      "WordPress + API",
      "Account manager",
      "SLA garantizado",
    ],
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

interface UserData {
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  articlesLimitPerMonth?: number;
  articlesUsedThisMonth?: number;
  billingCycleEnd?: string;
}

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Fetch current user subscription status
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/credits/check");
        if (res.ok) {
          const data = await res.json();
          setUser(data.data || {});
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, []);

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
      } else {
        toast.error(data.error || "Error al procesar el pago");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar el pago");
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = user?.subscriptionPlan
    ? SUBSCRIPTION_PLANS.find((p) => p.id === user.subscriptionPlan)
    : null;

  const isActive = user?.subscriptionStatus === "active";

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Planes de subscripción</h1>
        <p className="text-gray-500 mt-1">
          Elige el plan que mejor se adapta a tus necesidades. Todos incluyen acceso al panel completo.
        </p>
      </div>

      {/* Current subscription status */}
      {isActive && currentPlan && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-green-900">Plan activo: {currentPlan.name}</h3>
              <p className="text-sm text-green-700 mt-1">
                Tienes {user.articlesLimitPerMonth || 0} artículos disponibles al mes. Ya has usado {user.articlesUsedThisMonth || 0}.
              </p>
              {user.billingCycleEnd && (
                <p className="text-xs text-green-600 mt-2">
                  Próxima renovación: {new Date(user.billingCycleEnd).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-900">${currentPlan.price}</p>
              <p className="text-xs text-green-700">/mes</p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription plans */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mb-10">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentPlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              className={classNames(
                "relative rounded-2xl p-6 border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col",
                isCurrent
                  ? "border-brand-500 shadow-lg shadow-brand-500/10"
                  : plan.popular
                  ? "border-brand-200 shadow-sm"
                  : "border-gray-100 shadow-sm"
              )}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-sm whitespace-nowrap">
                  Más popular
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                  Plan actual
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
              </div>

              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-400 text-sm ml-1">/mes</span>
              </div>
              <p className="text-sm font-semibold text-brand-600 mb-5">
                {plan.articles} artículos incluidos
              </p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button disabled variant="outline" className="w-full">
                  Plan actual
                </Button>
              ) : (
                <Button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading === plan.id}
                  isLoading={loading === plan.id}
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                >
                  {loading === plan.id ? "Procesando..." : "Cambiar a este plan"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mt-12 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
        <div className="space-y-6">
          {[
            {
              q: "¿Puedo cambiar de plan en cualquier momento?",
              a: "Sí. Puedes cambiar a un plan superior o inferior en cualquier momento. Los cambios se reflejan en tu próxima facturación.",
            },
            {
              q: "¿Qué pasa si se me acaban los artículos antes de fin de mes?",
              a: "Puedes comprar artículos adicionales por $2/artículo, o cambiar a un plan superior sin costo adicional.",
            },
            {
              q: "¿Puedo cancelar en cualquier momento?",
              a: "Sí, sin penalizaciones. Cancela desde esta página y se detendrá la próxima facturación.",
            },
            {
              q: "¿Qué incluye cada plan?",
              a: "Todos los planes incluyen acceso completo al panel, white-label, WordPress, plantillas por industria y exportación en múltiples formatos.",
            },
          ].map((item, i) => (
            <div key={i}>
              <p className="font-semibold text-gray-900">{item.q}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
