"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { validatePassword } from "@/lib/utils";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    agencyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.agencyName.trim()) newErrors.agencyName = "El nombre de la agencia es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    const pv = validatePassword(formData.password);
    if (!pv.valid) newErrors.password = pv.errors[0];
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || "Error en el registro");
        return;
      }

      localStorage.setItem("userName", formData.name);
      localStorage.setItem("agencyName", formData.agencyName);
      toast.success("¡Cuenta creada! Bienvenido a ContentSEO");
      router.push("/dashboard");
    } catch {
      toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Left — Form */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 md:p-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900">ContentSEO</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Empieza gratis hoy
          </h1>
          <p className="text-gray-500 text-sm">
            1 mes gratis · Sin tarjeta · Cancela cuando quieras
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Tu nombre"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Carlos Méndez"
              required
            />
            <Input
              label="Nombre de tu agencia"
              name="agencyName"
              type="text"
              value={formData.agencyName}
              onChange={handleChange}
              error={errors.agencyName}
              placeholder="Agencia Prometeo"
              required
            />
          </div>

          <Input
            label="Email de trabajo"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="carlos@agenciaprometo.com"
            required
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Mínimo 8 caracteres"
              required
            />
            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repite la contraseña"
              required
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
            Crear cuenta gratis
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          Al registrarte aceptas nuestros{" "}
          <Link href="/terminos" className="underline hover:text-gray-600">Términos de uso</Link>
          {" "}y{" "}
          <Link href="/privacidad" className="underline hover:text-gray-600">Política de privacidad</Link>.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">
            Inicia sesión
          </Link>
        </p>
      </div>

      {/* Right — Social proof */}
      <div className="hidden lg:flex flex-col gap-8 px-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Únete a las agencias que ya escalan su contenido
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Sin contratar redactores. Sin esperas. Con tu marca.
          </p>
        </div>

        <ul className="space-y-4">
          {[
            { icon: "🚀", title: "150 artículos en tu primer mes", desc: "Gratis, sin tarjeta, sin compromiso." },
            { icon: "🏷️", title: "White-label desde el día 1", desc: "Tu dominio, tu logo, tu marca. Tus clientes no ven ContentSEO." },
            { icon: "⚡", title: "30 segundos por artículo", desc: "Lo que un redactor tarda días, tú lo tienes en medio minuto." },
            { icon: "🔌", title: "Publica en WordPress con 1 clic", desc: "Sin copiar-pegar. Directo al CMS de tu cliente." },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <figure className="rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100 p-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            "En 30 días generamos más contenido que en los 6 meses anteriores. Y nuestros clientes piensan que tenemos un equipo editorial enorme."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              C
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Carlos Méndez</p>
              <p className="text-xs text-gray-500">Director · Agencia Prometeo</p>
            </div>
          </div>
        </figure>
      </div>

    </div>
  );
}
