import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Precios de FeatSEO | Planes Flexibles para Agencias",
  description: "Planes de precios flexibles para agencias de cualquier tamaño. Desde $49/mes con generación IA, white-label y WordPress integrado. Primer mes gratis.",
  alternates: {
    canonical: "https://featseo.com/pricing",
  },
};

export default function PricingPage() {
  const plans = [
    {
      id: "starter",
      name: PLANS.starter.name,
      price: PLANS.starter.priceUSD,
      articles: PLANS.starter.articles,
      description: "Para freelancers y agencias pequeñas",
      popular: false,
      features: [
        `${PLANS.starter.articles} artículos / mes`,
        "Exportación MD, HTML, DOCX",
        "Plantillas por industria",
        "Soporte por email",
        "Primer mes gratis",
      ],
      cta: "Empezar ahora",
    },
    {
      id: "pro",
      name: PLANS.pro.name,
      price: PLANS.pro.priceUSD,
      articles: PLANS.pro.articles,
      description: "Para agencias en crecimiento",
      popular: true,
      features: [
        `${PLANS.pro.articles} artículos / mes`,
        "White-label (tu dominio y marca)",
        "Gestión multi-cliente",
        "WordPress en 1 clic",
        "Plantillas por industria",
        "Soporte prioritario",
        "Primer mes gratis",
      ],
      cta: "Empezar ahora",
    },
    {
      id: "agency",
      name: PLANS.agency.name,
      price: PLANS.agency.priceUSD,
      articles: PLANS.agency.articles,
      description: "Para grandes agencias",
      popular: false,
      features: [
        `${PLANS.agency.articles} artículos / mes`,
        "White-label + dominio",
        "Gestión multi-cliente ilimitada",
        "WordPress integrado",
        "Account manager dedicado",
        "API para integraciones",
        "Primer mes gratis",
      ],
      cta: "Empezar ahora",
    },
  ];

  const roi = [
    {
      plan: "Starter ($49)",
      articles: 20,
      pricePerArticle: 2.45,
      writerCost: 30,
      savings: "91.8% menos",
    },
    {
      plan: "Pro ($149)",
      articles: 80,
      pricePerArticle: 1.86,
      writerCost: 30,
      savings: "93.8% menos",
    },
    {
      plan: "Agency ($399)",
      articles: 250,
      pricePerArticle: 1.60,
      writerCost: 30,
      savings: "94.7% menos",
    },
  ];

  const faqs = [
    {
      q: "¿Puedo cambiar de plan en cualquier momento?",
      a: "Sí. Puedes cambiar tu plan o cancelar sin penalizaciones. Los cambios se reflejan en tu próxima facturación.",
    },
    {
      q: "¿Qué incluye el 'primer mes gratis'?",
      a: "El acceso completo al plan elegido durante 30 días sin coste. Sin tarjeta de crédito requerida. Después, se renueva automáticamente al precio regular.",
    },
    {
      q: "¿Los artículos 'no usados' se acumulan al mes siguiente?",
      a: "No. Los artículos son mensuales y se reinician el 1º de cada mes. Todos los planes incluyen primer mes gratis para que pruebes sin riesgo.",
    },
    {
      q: "¿Hay descuentos por facturación anual?",
      a: "Sí. Contacta a nuestro equipo para presupuestos personalizados y descuentos especiales para compromisos anuales.",
    },
    {
      q: "¿Cuál es la mejor opción para mi agencia?",
      a: "Depende del volumen de clientes y artículos mensuales. Starter: hasta 5 clientes. Pro: 5-20 clientes. Agency: 20+ clientes o 500+ artículos/mes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Precios simples y transparentes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
          Planes flexibles para agencias de cualquier tamaño. Paga por lo que usas.
        </p>
        <p className="text-sm text-gray-500">
          Todos los planes incluyen 1 mes gratis. Sin tarjeta de crédito.
        </p>
      </section>

      {/* Plans */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border transition-all ${
                plan.popular
                  ? "border-brand-500 bg-gradient-to-b from-brand-50 to-white shadow-lg scale-105"
                  : "border-gray-100 bg-white hover:shadow-lg"
              } p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="inline-block px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full mb-4 w-fit">
                  MÁS POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600 ml-2">/mes</span>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                {plan.articles} artículos generados al mes
              </p>

              <Link href="/register" className="block mb-6">
                <Button
                  size="lg"
                  className="w-full"
                  variant={plan.popular ? "primary" : "secondary"}
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-4">Incluye:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            ¿Cuánto ahorras con FeatSEO?
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comparado con contratar redactores freelance a $30/hora (aproximadamente $600-1000 por artículo).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roi.map((item) => (
              <div key={item.plan} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">{item.plan}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Artículos/mes:</span>
                    <span className="font-semibold text-gray-900">{item.articles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coste/artículo:</span>
                    <span className="font-semibold text-gray-900">${item.pricePerArticle.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">vs Redactor freelance:</span>
                    <span className="font-semibold text-gray-900">${item.writerCost}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ahorro:</span>
                      <span className="font-bold text-green-600">{item.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-8 max-w-2xl mx-auto">
            * Cálculos basados en redactores freelance españoles a €25-30/hora. Los ahorros reales pueden ser mayores si contratas localmente o agencias especializadas.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Preguntas frecuentes</h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{faq.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Listo para escalar
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Prueba FeatSEO durante 1 mes completamente gratis.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-base px-8">
            Empezar ahora
          </Button>
        </Link>
      </section>
    </div>
  );
}
