"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { classNames } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAuthenticated = !isLoading && user !== null;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/generator", label: "Generar" },
        { href: "/history", label: "Historial" },
        { href: "/credits", label: "Créditos" },
      ]
    : [];

  return (
    <nav
      className={classNames(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:shadow-xl group-hover:shadow-brand-600/30 transition-all duration-300">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className={classNames(
              "text-xl font-bold transition-colors duration-300",
              isScrolled ? "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent" : "text-white"
            )}>
              FeatSEO
            </span>
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={classNames(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isScrolled
                      ? "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/settings"
                  className={classNames(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isScrolled ? "text-gray-600 hover:text-brand-600 hover:bg-brand-50" : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {(user?.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name ?? ""}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className={classNames(
                    "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                    isScrolled
                      ? "text-gray-700 hover:text-brand-600 hover:bg-gray-100"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  Iniciar sesión
                </button>
                <Button size="sm" onClick={() => router.push("/register")}>
                  Registrarse
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={classNames(
                  "block h-0.5 rounded transition-all duration-300",
                  isScrolled ? "bg-gray-600" : "bg-white",
                  isMenuOpen ? "rotate-45 translate-y-[4px]" : ""
                )}
              />
              <span
                className={classNames(
                  "block h-0.5 rounded transition-all duration-300",
                  isScrolled ? "bg-gray-600" : "bg-white",
                  isMenuOpen ? "opacity-0" : ""
                )}
              />
              <span
                className={classNames(
                  "block h-0.5 rounded transition-all duration-300",
                  isScrolled ? "bg-gray-600" : "bg-white",
                  isMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""
                )}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={classNames(
          "md:hidden transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="glass border-t border-gray-100 px-4 py-4 space-y-1">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {(user?.name ?? "?").charAt(0).toUpperCase()}
                </div>
                Mi perfil
              </Link>
              <button
                onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => { setIsMenuOpen(false); router.push("/login"); }}
              >
                Iniciar sesión
              </Button>
              <Button
                className="w-full"
                onClick={() => { setIsMenuOpen(false); router.push("/register"); }}
              >
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
