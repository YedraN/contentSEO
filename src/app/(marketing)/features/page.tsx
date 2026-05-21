import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Características de FeatSEO | Generador de Artículos SEO para Agencias",
  description: "Descubre las características principales de FeatSEO: generación IA, white-label, WordPress 1-click, multi-cliente, plantillas por industria y más.",
  alternates: {
    canonical: "https://featseo.com/features",
  },
};

export default function FeaturesPage() {
  const features = [
    {
      category: "Generación",
      items: [
        {
          title: "Generación IA avanzada",
          description: "Usa los modelos más potentes de IA para generar artículos de 2.000+ palabras completamente originales, optimizados para SEO y listos para publicar.",
        },
        {
          title: "Plantillas por industria",
          description: "Inmobiliaria, legal, tecnología, salud, e-commerce y más. Cada industria tiene su estructura, tono y keywords óptimas predefinidas.",
        },
        {
          title: "Entrena tu voz",
          description: "Sube 3 artículos tuyos y la IA aprende tu estilo único: tono, vocabulario y forma de escribir. Los artículos suena como si los hubieras escrito tú.",
        },
        {
          title: "Multi-idioma",
          description: "Genera artículos en español, inglés, portugués, alemán y más. Configuración del idioma y tono por cliente.",
        },
      ],
    },
    {
      category: "Publicación & Distribución",
      items: [
        {
          title: "WordPress en 1 clic",
          description: "Publica directamente en el WordPress del cliente sin copiar-pegar. Se mantiene el formato, imágenes y estructura HTML.",
        },
        {
          title: "Descarga en 3 formatos",
          description: "Markdown, HTML o Word. Entrega al cliente en el formato que prefera con un solo clic.",
        },
        {
          title: "Editor inline",
          description: "Edita título y contenido directamente en FeatSEO. No necesitas herramientas externas ni copiar-pegar a Google Docs.",
        },
      ],
    },
    {
      category: "Para Agencias",
      items: [
        {
          title: "White-label completo",
          description: "Tu marca, tu dominio. Tus clientes ven tu agencia, nunca FeatSEO. Personaliza colores, logo, dominio e idioma.",
        },
        {
          title: "Gestión multi-cliente",
          description: "Un solo panel para todos tus clientes. Asigna proyectos, keywords y plantillas por cliente sin mezclarlos.",
        },
        {
          title: "Usuarios ilimitados",
          description: "Invita a todos los miembros de tu equipo. Cada uno gestiona sus clientes sin ver los datos de otros.",
        },
        {
          title: "API para integraciones",
          description: "Integra FeatSEO en tu flujo de trabajo: automatiza la generación, sincroniza con tu CRM o sistema de gestión.",
        },
      ],
    },
    {
      category: "SEO Técnico",
      items: [
        {
          title: "Meta tags automáticos",
          description: "Title tag, meta description y H1-H3 generados automáticamente y optimizados para CTR.",
        },
        {
          title: "Schema markup",
          description: "JSON-LD para Article, FAQ, BreadcrumbList y más. Mejora tu posicionamiento en busca y featured snippets.",
        },
        {
          title: "Densidad de keywords",
          description: "Control automático de densidad de palabras clave. Evita over-optimization y penalizaciones.",
        },
        {
          title: "Análisis de legibilidad",
          description: "Tiempo de lectura, complejidad de oraciones y sugerencias para mejorar la experiencia de lectura.",
        },
      ],
    },
  ];

  const comparison = [
    {
      feature: "Generación IA",
      featseo: true,
      competidor: true,
    },
    {
      feature: "White-label con dominio propio",
      featseo: true,
      competidor: false,
    },
    {
      feature: "Gestión multi-cliente",
      featseo: true,
      competidor: false,
    },
    {
      feature: "WordPress integrado",
      featseo: true,
      competidor: false,
    },
    {
      feature: "Plantillas por industria",
      featseo: true,
      competidor: true,
    },
    {
      feature: "Aprendizaje de voz",
      featseo: true,
      competidor: false,
    },
    {
      feature: "API pública",
      featseo: true,
      competidor: false,
    },
    {
      feature: "Soporte en español",
      featseo: true,
      competidor: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Características de FeatSEO
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Diseñado para agencias. Generación IA potente, publicación automática, white-label y gestión multi-cliente en una sola plataforma.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-16">
          {features.map((section) => (
            <div key={section.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{section.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Comparativa: FeatSEO vs Competencia
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Característica</th>
                  <th className="px-6 py-4 text-center font-semibold text-brand-600">FeatSEO</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Otros</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.featseo ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.competidor ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Listo para escalar tu agencia
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Empieza con 1 mes gratis. Sin tarjeta de crédito. Setup en 5 minutos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="text-base px-8">
              Solicitar acceso gratis
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="text-base px-8">
              Ver planes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
