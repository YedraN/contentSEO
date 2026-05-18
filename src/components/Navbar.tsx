"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/credits/check");
        if (response.ok) {
          setIsAuthenticated(true);
          const storedName = localStorage.getItem("userName");
          if (storedName) setUserName(storedName);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("userName");
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ContentSEO</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">Dashboard</Link>
                <Link href="/dashboard/generator" className="text-gray-600 hover:text-gray-900 transition">Generar</Link>
                <Link href="/dashboard/history" className="text-gray-600 hover:text-gray-900 transition">Historial</Link>
                <Link href="/dashboard/credits" className="text-gray-600 hover:text-gray-900 transition">Créditos</Link>
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <span className="text-sm text-gray-600">{userName}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>Salir</Button>
                </div>
              </>
            ) : (
              <>
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Características</Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Precios</Link>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>Iniciar sesión</Button>
                  <Button size="sm" onClick={() => router.push("/register")}>Registrarse</Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Dashboard</Link>
                <Link href="/dashboard/generator" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Generar</Link>
                <Link href="/dashboard/history" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Historial</Link>
                <Link href="/dashboard/credits" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Créditos</Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">Salir</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/login")}>Iniciar sesión</Button>
                <Button className="w-full" onClick={() => router.push("/register")}>Registrarse</Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
