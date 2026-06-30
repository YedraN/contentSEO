import type { Metadata, MetadataRoute } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://featseo.com"),
  title: {
    default: "FeatSEO — Generador de Artículos SEO para Agencias",
    template: "%s | FeatSEO",
  },
  description:
    "Genera 150+ artículos SEO al mes para los clientes de tu agencia. White-label, WordPress en 1 clic, 97% menos coste que un redactor. Prueba gratis.",
  keywords: [
    "generador artículos SEO",
    "contenido IA agencia",
    "SEO automático",
    "WordPress IA",
    "redactor IA agencia",
  ],
  authors: [{ name: "FeatSEO", url: "https://featseo.com" }],
  creator: "FeatSEO",
  publisher: "FeatSEO",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://featseo.com",
    title: "FeatSEO — Generador de Artículos SEO para Agencias",
    description:
      "Genera 150+ artículos SEO al mes. White-label, WordPress 1-click, 97% menos coste.",
    siteName: "FeatSEO",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FeatSEO - Generador de artículos SEO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FeatSEO — Generador de Artículos SEO",
    description: "Genera artículos SEO optimizados en minutos con IA.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "https://featseo.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
