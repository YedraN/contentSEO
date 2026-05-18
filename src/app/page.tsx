"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useEffect, useRef } from "react";
import anime from "animejs";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Generación con IA",
    description: "Artículos SEO optimizados generados con Groq AI. Contenido de calidad en segundos.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Optimización SEO",
    description: "Meta descriptions, palabras clave estratégicas y estructura HTML optimizada para buscadores.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Exportación múltiple",
    description: "Descarga en Markdown, HTML o Word (.docx). Compatible con WordPress y cualquier CMS.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Rápido y eficiente",
    description: "Artículos generados en 10-30 segundos. Ahorra horas de trabajo en contenido.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Tono personalizable",
    description: "Elige entre tono profesional, casual, técnico o amigable. Adapta el contenido a tu marca.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Sin configuración",
    description: "SaaS listo para usar. Regístrate, agrega tus palabras clave y obtén contenido al instante.",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    credits: 3,
    price: 9,
    description: "Perfecto para probar",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 10,
    price: 29,
    description: "Para creadores de contenido",
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    credits: 50,
    price: 99,
    description: "Para agencias y equipos",
    popular: false,
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroTl = anime.timeline({ easing: "easeOutCubic" });
    heroTl
      .add({ targets: ".hero-badge", opacity: [0, 1], translateY: [10, 0], duration: 600 })
      .add({ targets: ".hero-title", opacity: [0, 1], translateY: [20, 0], duration: 700 }, "-=400")
      .add({ targets: ".hero-sub", opacity: [0, 1], translateY: [20, 0], duration: 600 }, "-=400")
      .add({ targets: ".hero-cta", opacity: [0, 1], translateY: [20, 0], duration: 500 }, "-=300")
      .add({ targets: ".hero-stats", opacity: [0, 1], translateY: [20, 0], duration: 500 }, "-=200");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target.querySelectorAll(".feature-card"),
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 600,
              delay: anime.stagger(100),
              easing: "easeOutCubic",
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-brand-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-24 pb-16">
          <div className="hero-badge opacity-0 inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full text-sm font-medium text-brand-700 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Generación de contenido con IA
          </div>

          <h1 className="hero-title opacity-0 text-5xl md:text-7xl font-bold tracking-tight text-balance mb-6">
            Crea contenido SEO{" "}
            <span className="gradient-text">que funciona</span>
          </h1>

          <p className="hero-sub opacity-0 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Genera artículos optimizados para buscadores con inteligencia artificial. 
            Ahorra horas de trabajo y mejora tu posicionamiento web.
          </p>

          <div className="hero-cta opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-8">
                Comenzar gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                Ver características
              </Button>
            </Link>
          </div>

          <div className="hero-stats opacity-0 mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">10s</p>
              <p className="text-sm text-gray-500">por artículo</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">crédito gratis</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">Groq</p>
              <p className="text-sm text-gray-500">IA gratuita</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" ref={featuresRef} className="py-24 lg:py-32 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Características</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu contenido
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Herramientas profesionales para crear contenido SEO de forma rápida y eficiente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card opacity-0 p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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

      {/* Pricing */}
      <section id="pricing" ref={pricingRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">Precios</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planes simples y transparentes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Paga solo por los artículos que necesitas. Sin suscripciones ni sorpresas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`feature-card opacity-0 relative rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? "border-brand-500 bg-white shadow-lg shadow-brand-500/10"
                    : "border-gray-100 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                    Más popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/ único</span>
                </div>
                <div className="text-center mb-8">
                  <p className="text-3xl font-bold text-brand-600">{plan.credits}</p>
                  <p className="text-sm text-gray-500">artículos</p>
                </div>
                <Link href="/register">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full"
                  >
                    Comenzar ahora
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-brand-600 to-purple-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Comienza a crear contenido SEO hoy
          </h2>
          <p className="text-lg text-brand-100 mb-10 max-w-xl mx-auto">
            Regístrate gratis y obtén 1 artículo de prueba. Sin compromisos, sin tarjetas.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50 shadow-xl text-base px-10"
            >
              Crear cuenta gratis
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
