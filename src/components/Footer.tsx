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
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">ContentSEO</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Genera contenido SEO optimizado con IA para tu sitio web. Ahorra tiempo y mejora tu posicionamiento.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Producto</h3>
            <ul className="space-y-3">
              <li><Link href="/generator" className="text-sm hover:text-white transition-colors">Generador</Link></li>
              <li><Link href="/credits" className="text-sm hover:text-white transition-colors">Precios</Link></li>
              <li><Link href="/login" className="text-sm hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Recursos</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Documentación</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Soporte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Términos</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} ContentSEO. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="/" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="/" className="hover:text-white transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
