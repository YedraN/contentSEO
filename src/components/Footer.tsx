import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-white">FeatSEO</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              La plataforma de contenido SEO white-label para agencias de marketing que quieren escalar sin contratar redactores.
            </p>
            <a
              href="mailto:hola@featseo.io"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              hola@featseo.io
            </a>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Producto</h3>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm hover:text-white transition-colors">Características</Link></li>
              <li><Link href="/#pricing" className="text-sm hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="/register" className="text-sm hover:text-white transition-colors">Acceso gratis</Link></li>
              <li><Link href="/login" className="text-sm hover:text-white transition-colors">Iniciar sesión</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Para agencias</h3>
            <ul className="space-y-3">
              <li><Link href="/#pricing" className="text-sm hover:text-white transition-colors">White-label</Link></li>
              <li><Link href="/#pricing" className="text-sm hover:text-white transition-colors">Plan Enterprise</Link></li>
              <li>
                <a href="mailto:hola@featseo.io" className="text-sm hover:text-white transition-colors">
                  Hablar con ventas
                </a>
              </li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Documentación API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacidad" className="text-sm hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="/terminos" className="text-sm hover:text-white transition-colors">Términos de uso</Link></li>
              <li><Link href="/cookies" className="text-sm hover:text-white transition-colors">Política de cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} FeatSEO. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Twitter / X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
