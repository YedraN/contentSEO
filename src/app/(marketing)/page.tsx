import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { AnimationsWrapper } from "@/components/landing/AnimationsWrapper";
import ArticleGenerationPreview from "@/components/landing/ArticleGenerationPreview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FeatSEO — Generador de Artículos SEO con IA para Agencias",
  description:
    "Genera 250+ artículos SEO al mes para los clientes de tu agencia. White-label, WordPress en 1 clic, 97% menos coste que un redactor. Prueba gratis.",
  alternates: { canonical: "https://featseo.com" },
};

const features = [
  {
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
    title: "White-label completo",
    description: "Tu marca, tu dominio. Tus clientes ven tu agencia, nunca FeatSEO.",
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    title: "Gestión multi-cliente",
    description: "Un panel para todos tus clientes. Proyectos, keywords y plantillas separados.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    title: "WordPress en 1 clic",
    description: "Publica directamente en el WordPress de tu cliente. Sin copiar-pegar, sin perder formato.",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
    title: "Plantillas por industria",
    description: "Inmobiliaria, legal, tecnología, salud, e-commerce. Cada sector con su estructura óptima.",
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
    title: "Entrena tu voz",
    description: "Sube 3 artículos y la IA aprende el estilo único de cada cliente: tono, vocabulario, estructura.",
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    title: "SEO técnico incluido",
    description: "Title tag, meta description, H1-H3, densidad de keywords y schema markup en cada artículo.",
    color: "bg-yellow-500/10 text-yellow-400",
  },
];

const steps = [
  {
    number: "01",
    title: "Configura el cliente",
    description: "Nombre, industria, keywords objetivo, idioma y tono de comunicación. Se guarda para siempre.",
  },
  {
    number: "02",
    title: "La IA escribe",
    description: "FeatSEO genera un artículo de 2.000+ palabras en 30 segundos. Optimizado para posicionar.",
  },
  {
    number: "03",
    title: "Publica con 1 clic",
    description: "Descarga en MD, HTML o Word, o publica directamente en el WordPress del cliente.",
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
    features: ["20 artículos / mes", "Exportación MD, HTML, DOCX", "Plantillas por industria", "Soporte por email", "Primer mes gratis"],
    cta: "Empezar gratis",
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    articles: 80,
    description: "Para agencias en crecimiento",
    popular: true,
    features: ["80 artículos / mes", "White-label (tu dominio y marca)", "Gestión multi-cliente", "WordPress en 1 clic", "Soporte prioritario", "Primer mes gratis"],
    cta: "Empezar gratis",
  },
  {
    id: "agency",
    name: "Agency",
    price: 399,
    articles: 250,
    description: "Para grandes agencias",
    popular: false,
    features: ["250 artículos / mes", "White-label + dominio propio", "Clientes ilimitados", "Account manager dedicado", "API para integraciones", "Primer mes gratis"],
    cta: "Empezar gratis",
  },
];

const faqs = [
  {
    q: "¿El contenido generado es realmente útil para SEO?",
    a: "Sí. Cada artículo incluye title tag, meta description, estructura H1-H3, densidad de keywords controlada y schema markup. Configuras las keywords objetivo y la industria antes de generar.",
  },
  {
    q: "¿Mis clientes sabrán que uso FeatSEO?",
    a: "No. Con el plan Pro y Agency activas el white-label: tu dominio, tu logo, tus colores. Tus clientes ven tu agencia, no nosotros.",
  },
  {
    q: "¿Qué pasa si necesito más de 250 artículos al mes?",
    a: "Escríbenos a hola@featseo.com y te hacemos un plan a medida. Tenemos agencias generando más de 500 artículos mensuales.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí, sin penalizaciones ni permanencia. Cancelas desde el panel y no se renueva el siguiente mes.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FeatSEO",
  applicationCategory: "BusinessApplication",
  description: "Generador de artículos SEO optimizados con IA para agencias",
  offers: { "@type": "Offer", price: "49", priceCurrency: "USD", url: "https://featseo.com" },
  operatingSystem: "Web",
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <AnimationsWrapper>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative min-h-screen bg-slate-950 flex items-center overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
              {/* Left — copy */}
              <div className="order-2 lg:order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-indigo-300 tracking-wide">Para agencias SEO y de marketing</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-[64px] font-black text-white leading-[1.04] tracking-tight mb-6">
                  Tu agencia publica{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      250 artículos
                    </span>
                    <span className="absolute inset-x-0 bottom-1 h-3 bg-indigo-500/15 -skew-x-2 rounded" />
                  </span>
                  {" "}SEO.
                  <br />
                  Este mes.
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
                  FeatSEO genera artículos de{" "}
                  <span className="text-white font-semibold">2.000+ palabras en 30 segundos</span>{" "}
                  para todos tus clientes. Con su voz, en su idioma, directo a su WordPress.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/register">
                    <Button size="lg" className="text-base px-8 shadow-2xl shadow-indigo-500/25">
                      Empieza gratis — 1 mes sin coste
                    </Button>
                  </Link>
                  <Link href="#pricing">
                    <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-300 border border-white/15 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200">
                      Ver precios
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </Link>
                </div>

                {/* Trust */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                  {["Sin tarjeta de crédito", "Setup en 5 minutos", "Cancela cuando quieras"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — generation preview */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <ArticleGenerationPreview />
              </div>
            </div>
          </div>

          {/* Stats bar at bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-t border-white/[0.06] py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { value: "2.000+", label: "palabras por artículo" },
                  { value: "30 seg", label: "de generación" },
                  { value: "12", label: "idiomas disponibles" },
                  { value: "97%", label: "menos coste vs. redactor" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl font-black text-white tracking-tight">{s.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BEFORE / AFTER ──────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">El problema que resolvemos</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                El cuello de botella{" "}
                <span className="text-gray-400">que frena tu agencia</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-14" data-animation="fade-up">
              {/* Before */}
              <div className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-7">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500">Sin FeatSEO</p>
                </div>
                <ul className="space-y-3.5">
                  {[
                    "Redactores freelance a €0,06/palabra — €900+/mes",
                    "5-7 días de entrega por artículo",
                    "Tono inconsistente entre clientes",
                    "Máximo 20 artículos/mes por capacidad",
                    "Clientes insatisfechos por retrasos",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-7">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Con FeatSEO</p>
                </div>
                <ul className="space-y-3.5">
                  {[
                    "€399/mes — 250 artículos incluidos (€1,60 c/u)",
                    "Entrega en menos de 60 segundos",
                    "Plantillas por industria: tono consistente siempre",
                    "250 artículos/mes para clientes ilimitados",
                    "White-label: los clientes ven tu marca",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Big numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { value: "85%", label: "reducción de costes" },
                { value: "250", label: "artículos en 30 días" },
                { value: "3×", label: "más clientes cerrados" },
                { value: "0", label: "redactores en plantilla" },
              ].map((stat, i) => (
                <div
                  key={i}
                  data-animation="fade-up"
                  className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <p className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">Cómo funciona</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                De brief a publicado{" "}
                <span className="text-indigo-500">en 90 segundos</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" data-animation="fade-up">
              {steps.map((step, i) => (
                <div key={i} className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <div className="text-6xl font-black text-gray-100 leading-none mb-4 select-none">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section id="features" className="py-20 lg:py-28 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">Funcionalidades</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Todo lo que tu agencia{" "}
                <br className="hidden md:block" />
                necesita para escalar
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={i}
                  data-animation="fade-up"
                  className="group p-7 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL ─────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <figure className="text-center" data-animation="fade-up">
              <div className="flex justify-center mb-8">
                <svg className="w-10 h-10 text-indigo-500/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <blockquote className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium mb-10 max-w-3xl mx-auto">
                "Llevábamos dos años queriendo escalar el servicio de contenidos pero el cuello de botella siempre eran los redactores. Con FeatSEO generamos en una tarde lo que antes tardábamos tres semanas."
              </blockquote>
              <figcaption className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  C
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Carlos Méndez</p>
                  <p className="text-xs text-slate-500">Director de Marketing · Agencia Prometeo</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────── */}
        <section id="pricing" className="py-20 lg:py-28 bg-gray-50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">Precios</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Planes para agencias
              </h2>
              <p className="text-lg text-gray-500 mt-4 max-w-lg mx-auto">
                Primer mes completamente gratis. Sin tarjeta. Cancela cuando quieras.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <div
                  key={plan.id}
                  data-animation="fade-up"
                  className={`relative rounded-2xl border-2 bg-white flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-[1.02]"
                      : "border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg tracking-wide">
                      Más popular
                    </div>
                  )}

                  <div className="p-8 flex-1">
                    <div className="mb-6">
                      <h3 className="text-lg font-black text-gray-900 mb-0.5">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>

                    <div className="mb-2">
                      <span className="text-5xl font-black text-gray-900 tracking-tight">${plan.price}</span>
                      <span className="text-gray-400 text-sm ml-2">/mes</span>
                    </div>
                    <p className="text-sm font-semibold text-indigo-600 mb-7">
                      {plan.articles} artículos incluidos
                    </p>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-8 pb-8">
                    <Link href="/register">
                      <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-400 mt-8">
              ¿Más de 250 artículos al mes?{" "}
              <a href="mailto:hola@featseo.com" className="text-indigo-600 font-semibold hover:underline">
                Escríbenos
              </a>{" "}
              y hacemos un plan personalizado.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Lo que preguntan las agencias
              </h2>
            </div>
            <div className="space-y-3" data-animation="fade-up">
              {faqs.map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-indigo-100 transition-colors">
                  <p className="font-bold text-gray-900 mb-2 text-sm">{item.q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────── */}
        <section className="py-28 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(99,102,241,0.12),transparent)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-400 mb-5">
              Empieza hoy
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Tu agencia puede generar{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                250 artículos
              </span>{" "}
              este mes.
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Primer mes completamente gratis. Sin tarjeta de crédito.
              Si no te convence, no pagas nada.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/register">
                <Button size="lg" className="text-base px-10 shadow-2xl shadow-indigo-500/25">
                  Solicitar acceso gratis
                </Button>
              </Link>
              <a href="mailto:hola@featseo.com" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
                O escríbenos directamente →
              </a>
            </div>
            <p className="text-xs text-slate-600">
              Sin permanencia · Cancela cuando quieras · Soporte en español
            </p>
          </div>
        </section>
      </AnimationsWrapper>
    </>
  );
}
