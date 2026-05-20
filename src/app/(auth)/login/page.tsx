"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setGeneralError("Introduce tu email y contraseña.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setGeneralError(data.error || "Email o contraseña incorrectos.");
        toast.error(data.error || "Email o contraseña incorrectos.");
        return;
      }

      if (data.data?.name) {
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("isLoggedIn", "true");
      }
      toast.success("Bienvenido de nuevo");
      router.push("/dashboard");
    } catch {
      setGeneralError("Error de conexión. Inténtalo de nuevo.");
      toast.error("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 md:p-10">

        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900">ContentSEO</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-500 text-sm">
            Accede al panel de tu agencia
          </p>
        </div>

        {generalError && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="carlos@miagencia.com"
            required
          />

          <div>
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <div className="text-right mt-1.5">
              <span className="text-xs text-brand-600 hover:text-brand-700 cursor-pointer font-medium">
                ¿Olvidaste tu contraseña?
              </span>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="text-brand-600 font-semibold hover:text-brand-700">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
