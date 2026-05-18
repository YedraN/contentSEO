import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">ContentSEO</h1>
        <p className="text-xl text-gray-600 mb-8">
          Genera artículos SEO optimizados con IA para tu empresa
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
