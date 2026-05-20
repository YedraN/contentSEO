import type { Metadata, MetadataRoute } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://contentseo.io"),
  title: {
    default: "ContentSEO — Generador de Artículos SEO para Agencias",
    template: "%s | ContentSEO",
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
  authors: [{ name: "ContentSEO", url: "https://contentseo.io" }],
  creator: "ContentSEO",
  publisher: "ContentSEO",
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
    url: "https://contentseo.io",
    title: "ContentSEO — Generador de Artículos SEO para Agencias",
    description:
      "Genera 150+ artículos SEO al mes. White-label, WordPress 1-click, 97% menos coste.",
    siteName: "ContentSEO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ContentSEO - Generador de artículos SEO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentSEO — Generador de Artículos SEO",
    description: "Genera artículos SEO optimizados en minutos con IA.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://contentseo.io",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
