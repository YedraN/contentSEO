import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-white">ContentSEO</span>
            </div>
            <p className="text-sm">Genera contenido SEO automático para tu sitio web</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-white transition">Características</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition">Precios</Link></li>
              <li><Link href="/" className="hover:text-white transition">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/" className="hover:text-white transition">Contacto</Link></li>
              <li><Link href="/" className="hover:text-white transition">Soporte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Privacidad</Link></li>
              <li><Link href="/" className="hover:text-white transition">Términos</Link></li>
              <li><Link href="/" className="hover:text-white transition">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800"></div>

        <div className="mt-8 flex justify-between items-center text-sm">
          <p>&copy; {currentYear} ContentSEO. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition">Twitter</Link>
            <Link href="/" className="hover:text-white transition">GitHub</Link>
            <Link href="/" className="hover:text-white transition">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
