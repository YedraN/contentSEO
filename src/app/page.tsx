import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { AnimationsWrapper } from "@/components/landing/AnimationsWrapper";
import Article3DSection from "@/components/landing/Article3DSection";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "FeatSEO — Generador de Artículos SEO con IA para Agencias",
  description: "Genera 150+ artículos SEO al mes para los clientes de tu agencia. White-label, WordPress en 1 clic, 97% menos coste que un redactor. Prueba gratis.",
  alternates: {
    canonical: "https://featseo.com",
  },
};

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "White-label completo",
    description: "Tu marca, tu dominio. Tus clientes ven tu agencia, nunca FeatSEO. Personaliza colores, logo e idioma.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Gestión multi-cliente",
    description: "Un solo panel para todos tus clientes. Asigna proyectos, keywords y plantillas por cliente sin mezclarlos.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "WordPress en 1 clic",
    description: "Publica directamente en el WordPress de tu cliente. Sin copiar-pegar. Sin perder formato. Con imágenes destacadas.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "Plantillas por industria",
    description: "Inmobiliaria, legal, tecnología, salud, e-commerce. Cada industria tiene su estructura, tono y keywords óptimas.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    title: "Entrena tu voz",
    description: "Sube 3 artículos tuyos y la IA aprende tu estilo único: tono, vocabulario y forma de escribir. Los artículos generados sonarán como si los hubieras escrito tú.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "SEO técnico incluido",
    description: "Title tag, meta description, H1-H3, densidad de keywords y schema markup generados automáticamente en cada artículo.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Exporta en cualquier formato",
    description: "Descarga en Markdown, HTML o Word. Entrega al cliente en el formato que prefiera, con un solo clic.",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    articles: 20,
    description: "Para freelancers y agencias pequeñas",
    popular: false,
    features: [
      "20 artículos / mes",
      "Exportación MD, HTML, DOCX",
      "Plantillas por industria",
      "Soporte por email",
      "Primer mes gratis",
    ],
    cta: "Empezar ahora",
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    articles: 80,
    description: "Para agencias en crecimiento",
    popular: true,
    features: [
      "80 artículos / mes",
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
    name: "Agency",
    price: 399,
    articles: 250,
    description: "Para grandes agencias",
    popular: false,
    features: [
      "250 artículos / mes",
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

const faqs = [
  {
    q: "¿El contenido generado es realmente útil para SEO?",
    a: "Sí. Cada artículo incluye title tag, meta description, estructura H1-H3, densidad de keywords controlada y schema markup. No es contenido genérico: configuras las keywords objetivo y la industria antes de generar.",
  },
  {
    q: "¿Mis clientes sabrán que uso FeatSEO?",
    a: "No. Con el plan Professional y Enterprise activas el white-label: tu dominio, tu logo, tus colores. Tus clientes ven tu agencia, no nosotros.",
  },
  {
    q: "¿Qué pasa si necesito más de 150 artículos al mes?",
    a: "Escríbenos a hola@featseo.com y te hacemos un plan a medida. Tenemos agencias generando más de 500 artículos mensuales.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí, sin penalizaciones ni permanencia. Cancelas desde el panel y no se renueva el siguiente mes.",
  },
];

const jsonLdSoftwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FeatSEO",
  applicationCategory: "BusinessApplication",
  description: "Generador de artículos SEO optimizados con IA para agencias",
  offers: {
    "@type": "Offer",
    price: "49",
    priceCurrency: "USD",
    url: "https://featseo.com",
  },
  operatingSystem: "Web",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FeatSEO",
  url: "https://featseo.com",
  logo: "https://featseo.com/logo.svg",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "hola@featseo.com",
  },
  sameAs: ["https://twitter.com/featseo"],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <AnimationsWrapper>
        <main>
          {/* Hero */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-brand-50/30">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-100/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full text-sm font-medium text-brand-700 mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Hecho para agencias de marketing y SEO
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance mb-6 leading-[1.05]">
                Escala tu agencia{" "}
                <span className="gradient-text">sin contratar redactores</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Genera <strong className="text-gray-900">150+ artículos SEO al mes</strong> para los clientes de tu agencia.
                White-label, integración con WordPress y plantillas por industria. Tú lo vendes, nosotros lo generamos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="text-base px-8">
                    Solicitar acceso gratis
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button variant="outline" size="lg" className="text-base px-8">
                    Ver planes
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Prueba 1 mes gratis · Sin tarjeta · Setup en 5 minutos
              </p>

              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">150+</p>
                  <p className="text-sm text-gray-500 mt-1">artículos / mes</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">30s</p>
                  <p className="text-sm text-gray-500 mt-1">por artículo</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">97%</p>
                  <p className="text-sm text-gray-500 mt-1">menos coste vs. redactor</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900">White-label</p>
                  <p className="text-sm text-gray-500 mt-1">tu marca, tu dominio</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3D Scroll Section */}
          <Article3DSection />

          {/* Features */}
          <section id="features" className="py-24 lg:py-32 scroll-mt-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Para agencias serias</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Todo lo que tu agencia necesita para escalar
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Deja de pagar redactores por artículo. Genera contenido de calidad para todos tus clientes desde un solo panel, con tu marca.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    data-animation="fade-up"
                    className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-5">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social proof */}
          <section className="py-24 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Resultados reales</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Cómo Agencia Prometeo escaló a{" "}
                  <span className="gradient-text">120 artículos al mes</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Una agencia de 8 personas, 14 clientes activos y sin un solo redactor en plantilla.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                <div className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-5">Antes de FeatSEO</p>
                  <ul className="space-y-4">
                    {[
                      "3 redactores freelance a €0,06/palabra → €900/mes mínimo",
                      "Entregas en 5-7 días por artículo",
                      "Inconsistencia de tono entre clientes",
                      "Máximo 20 artículos/mes por capacidad",
                      "Clientes insatisfechos por retrasos",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/50 p-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-5">Después de FeatSEO</p>
                  <ul className="space-y-4">
                    {[
                      "€399/mes → 150 artículos incluidos (€2,66/artículo)",
                      "Entrega en menos de 60 segundos",
                      "Plantillas por industria: tono consistente siempre",
                      "120 artículos/mes para 14 clientes distintos",
                      "3 clientes nuevos en 2 meses gracias al white-label",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
                {[
                  { value: "85%", label: "reducción de costes de contenido" },
                  { value: "120", label: "artículos generados en 30 días" },
                  { value: "3×", label: "más clientes en 60 días" },
                  { value: "0", label: "redactores en plantilla" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-6 rounded-2xl bg-gray-50">
                    <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="max-w-3xl mx-auto">
                <figure className="rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100 p-10">
                  <svg className="w-8 h-8 text-brand-300 mb-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                    "Llevábamos dos años queriendo escalar el servicio de contenidos pero el cuello de botella siempre eran los redactores. Con FeatSEO generamos en una tarde lo que antes tardábamos tres semanas. Y el white-label nos permitió presentarlo como nuestro propio producto a los clientes."
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      C
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Carlos Méndez</p>
                      <p className="text-sm text-gray-500">Director de Marketing Digital · Agencia Prometeo</p>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Precios</p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Planes pensados para agencias
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Primer mes completamente gratis. Sin tarjeta. Sin permanencia. Cancela cuando quieras.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    data-animation="fade-up"
                    className={`relative rounded-2xl p-8 border-2 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      plan.popular
                        ? "border-brand-500 bg-white shadow-lg shadow-brand-500/10"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                        Más popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      {plan.price ? (
                        <>
                          <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-gray-500 ml-2 text-sm">/ mes</span>
                          {plan.articles && (
                            <p className="text-sm text-brand-600 font-medium mt-1">{plan.articles} artículos incluidos</p>
                          )}
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-gray-900">A medida</span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.id === "enterprise" ? "mailto:hola@featseo.com" : "/register"}>
                      <Button
                        variant={plan.popular ? "primary" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-8">
                ¿Necesitas más de 150 artículos al mes?{" "}
                <a href="mailto:hola@featseo.com" className="text-brand-600 font-medium hover:underline">
                  Escríbenos
                </a>{" "}
                y te hacemos un plan personalizado.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Preguntas frecuentes</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Lo que nos preguntan las agencias</h2>
              </div>
              <div className="space-y-6">
                {faqs.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                    <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="py-28 bg-gradient-to-br from-gray-900 via-brand-950 to-purple-950 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-4xl mx-auto px-4 text-center">
              <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-4">Empieza hoy</p>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tu agencia puede generar<br />
                <span className="gradient-text">150 artículos este mes</span>
              </h2>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Primer mes completamente gratis. Sin tarjeta de crédito. Setup en 5 minutos.
                Si no te convence, no pagas nada.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="text-base px-10 shadow-xl shadow-brand-500/20">
                    Solicitar acceso gratis
                  </Button>
                </Link>
                <a href="mailto:hola@featseo.com" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  O escríbenos directamente →
                </a>
              </div>
              <p className="mt-8 text-xs text-gray-600">
                Sin permanencia · Cancela cuando quieras · Soporte en español
              </p>
            </div>
          </section>
        </main>
      </AnimationsWrapper>
    </>
  );
}
