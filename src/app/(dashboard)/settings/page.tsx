"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { COMPANY_TYPES, LANGUAGE_OPTIONS, CONTENT_TONE_OPTIONS } from "@/lib/prompts";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasFeature } from "@/lib/plans";
import { useAuth } from "@/contexts/AuthContext";

function SectionIcon({ path, color }: { path: string; color: string }) {
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [name, setName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [defaultLanguage, setDefaultLanguage] = useState("es");
  const [defaultTone, setDefaultTone] = useState("professional");
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // WordPress
  const [wpUrl, setWpUrl] = useState("");
  const [wpUsername, setWpUsername] = useState("");
  const [wpPassword, setWpPassword] = useState("");
  const [wpConnected, setWpConnected] = useState(false);
  const [savingWp, setSavingWp] = useState(false);
  const [testingWp, setTestingWp] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      setName(user.name || "");
      setDefaultLanguage(user.defaultLanguage || "es");
      setDefaultTone(user.defaultTone || "professional");
    }

    fetch("/api/wordpress/credentials")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.connected) {
          setWpConnected(true);
          setWpUrl(d.data.url || "");
        }
      })
      .catch(() => {});
  }, [user, isLoading]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, agencyName }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Perfil actualizado");
      } else {
        toast.error(data.error || "Error guardando perfil");
      }
    } catch {
      toast.error("Error guardando perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultLanguage, defaultTone }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Preferencias guardadas");
      } else {
        toast.error(data.error || "Error guardando preferencias");
      }
    } catch {
      toast.error("Error guardando preferencias");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Contraseña actualizada");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Error actualizando contraseña");
      }
    } catch {
      toast.error("Error actualizando contraseña");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleTestWordPress = async () => {
    if (!wpUrl || !wpUsername || !wpPassword) {
      toast.error("Completa todos los campos");
      return;
    }
    setTestingWp(true);
    try {
      const res = await fetch("/api/wordpress/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          wordpressUrl: wpUrl,
          wordpressUsername: wpUsername,
          wordpressPassword: wpPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("¡Conexión exitosa!");
      } else {
        toast.error(data.error || "Error conectando a WordPress");
      }
    } catch {
      toast.error("Error testando conexión");
    } finally {
      setTestingWp(false);
    }
  };

  const handleSaveWordPress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wpUrl || !wpUsername || !wpPassword) {
      toast.error("Completa todos los campos");
      return;
    }
    setSavingWp(true);
    try {
      const res = await fetch("/api/wordpress/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          wordpressUrl: wpUrl,
          wordpressUsername: wpUsername,
          wordpressPassword: wpPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWpConnected(true);
        toast.success("WordPress conectado exitosamente");
      } else {
        toast.error(data.error || "Error guardando credenciales");
      }
    } catch {
      toast.error("Error guardando credenciales");
    } finally {
      setSavingWp(false);
    }
  };

  const handleDisconnectWordPress = async () => {
    if (!confirm("¿Desconectar WordPress?")) return;
    setSavingWp(true);
    try {
      const res = await fetch("/api/wordpress/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      const data = await res.json();
      if (data.success) {
        setWpConnected(false);
        setWpUrl("");
        setWpUsername("");
        setWpPassword("");
        toast.success("Desconectado de WordPress");
      }
    } catch {
      toast.error("Error desconectando");
    } finally {
      setSavingWp(false);
    }
  };

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra tu perfil, preferencias y seguridad</p>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* Avatar + resumen */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-600/20 shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-lg truncate">{name || "Tu nombre"}</p>
            {agencyName && (
              <p className="text-sm text-gray-500 truncate">{agencyName}</p>
            )}
            {user?.credits !== undefined && (
              <span className="inline-flex items-center gap-1.5 mt-2 bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                {user.credits} crédito{user.credits !== 1 ? "s" : ""} disponible{user.credits !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <SectionIcon
              color="bg-brand-50 text-brand-600"
              path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">Perfil de agencia</h2>
              <p className="text-xs text-gray-500">Tu información personal y de agencia</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan García"
              />
              <Input
                label="Nombre de agencia"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Marketing Pro SL"
              />
            </div>
            <div className="pt-1">
              <Button type="submit" disabled={savingProfile} variant="secondary">
                {savingProfile ? "Guardando..." : "Guardar perfil"}
              </Button>
            </div>
          </form>
        </div>

        {/* Clientes */}
        <ClientsSection subscriptionPlan={user?.subscriptionPlan ?? null} />

        {/* Preferencias */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <SectionIcon
              color="bg-purple-50 text-purple-600"
              path="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">Preferencias de generación</h2>
              <p className="text-xs text-gray-500">Valores por defecto al crear nuevos artículos</p>
            </div>
          </div>

          <form onSubmit={handleSavePrefs} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Idioma por defecto</label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200"
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tono por defecto</label>
                <select
                  value={defaultTone}
                  onChange={(e) => setDefaultTone(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200"
                >
                  {CONTENT_TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Estos valores se precargan en el generador cada vez que abres la página
            </p>
            <div className="pt-1">
              <Button type="submit" disabled={savingPrefs} variant="secondary">
                {savingPrefs ? "Guardando..." : "Guardar preferencias"}
              </Button>
            </div>
          </form>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <SectionIcon
              color="bg-amber-50 text-amber-600"
              path="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">Seguridad</h2>
              <p className="text-xs text-gray-500">Cambia tu contraseña de acceso</p>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nueva contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-gray-400">Mínimo 8 caracteres</p>
            <div className="pt-1">
              <Button type="submit" disabled={savingPassword} variant="secondary">
                {savingPassword ? "Actualizando..." : "Cambiar contraseña"}
              </Button>
            </div>
          </form>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <SectionIcon
              color="bg-green-50 text-green-600"
              path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">Plan y créditos</h2>
              <p className="text-xs text-gray-500">Gestiona tu suscripción y recargas</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Créditos disponibles</p>
              <p className="text-3xl font-bold text-brand-600 mt-0.5">
                {isLoading || user?.credits === undefined ? "—" : user.credits}
              </p>
            </div>
            <Link href="/credits">
              <button className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                Ver planes
              </button>
            </Link>
          </div>
        </div>

        {/* WordPress section */}
        {hasFeature(user?.subscriptionPlan ?? null, "wordpress") ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              {SECTION_ICON("M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z")}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Integración WordPress</h2>
              <p className="text-xs text-gray-500">Publica artículos directamente en tu web</p>
            </div>
          </div>

          {wpConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-900">✓ Conectado a WordPress</p>
                  <p className="text-xs text-green-700 mt-0.5">{wpUrl}</p>
                </div>
                <button
                  onClick={handleDisconnectWordPress}
                  disabled={savingWp}
                  className="text-xs text-green-700 font-semibold hover:underline disabled:opacity-50"
                >
                  Desconectar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveWordPress} className="space-y-4">
              <Input
                label="URL de WordPress"
                value={wpUrl}
                onChange={(e) => setWpUrl(e.target.value)}
                placeholder="https://misite.com"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Usuario"
                  value={wpUsername}
                  onChange={(e) => setWpUsername(e.target.value)}
                  placeholder="admin"
                />
                <Input
                  label="Contraseña"
                  type="password"
                  value={wpPassword}
                  onChange={(e) => setWpPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-400">Tu contraseña se encripta y nunca se muestra</p>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTestWordPress}
                  disabled={savingWp || testingWp}
                >
                  {testingWp ? "Testando..." : "Probar conexión"}
                </Button>
                <Button type="submit" disabled={savingWp || testingWp}>
                  {savingWp ? "Conectando..." : "Conectar WordPress"}
                </Button>
              </div>
            </form>
          )}
        </div>
        ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              {SECTION_ICON("M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z")}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Integración WordPress</h2>
              <p className="text-xs text-gray-500">Publica artículos directamente en tu web</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm font-semibold text-amber-900 mb-2">Disponible en plan Pro o Agency</p>
            <p className="text-xs text-amber-700 mb-3">
              Sube de plan para conectar tu WordPress y publicar artículos con un clic desde ContentSEO.
            </p>
            <Link href="/credits">
              <button className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline">
                Ver planes de pago →
              </button>
            </Link>
          </div>
        </div>
        )}

        {/* Cerrar sesión */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <SectionIcon
              color="bg-red-50 text-red-600"
              path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
            <div>
              <h2 className="text-base font-bold text-gray-900">Sesión</h2>
              <p className="text-xs text-gray-500">Cierra tu sesión actual</p>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                await logout();
                toast.success("Sesión cerrada");
                router.push("/");
              } catch {
                toast.error("Error al cerrar sesión");
              }
            }}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Voz y estilo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
              {SECTION_ICON("M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z")}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Entrenar voz de IA</h2>
              <p className="text-xs text-gray-500">Entrena a la IA para que imite tu estilo de escritura</p>
            </div>
          </div>

          <VoiceTrainingSection />
        </div>

      </div>
    </div>
  );
}

function SECTION_ICON(path: string) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

interface VoiceProfileItem {
  id: string;
  name: string;
  sampleCount: number;
  createdAt: string;
}

function VoiceTrainingSection() {
  const [profiles, setProfiles] = useState<VoiceProfileItem[]>([]);
  const [profileName, setProfileName] = useState("");
  const [articles, setArticles] = useState<string[]>([""]);
  const [training, setTraining] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const res = await fetch("/api/voice/profiles");
      const data = await res.json();
      if (data.success) setProfiles(data.data);
    } catch {}
    setLoading(false);
  };

  const addArticleField = () => {
    if (articles.length < 5) setArticles([...articles, ""]);
  };

  const removeArticleField = (index: number) => {
    if (articles.length > 1) setArticles(articles.filter((_, i) => i !== index));
  };

  const updateArticle = (index: number, value: string) => {
    const updated = [...articles];
    updated[index] = value;
    setArticles(updated);
  };

  const handleTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("El nombre del perfil es requerido");
      return;
    }
    const nonEmpty = articles.filter((a) => a.trim().length >= 100);
    if (nonEmpty.length === 0) {
      toast.error("Debes proporcionar al menos un artículo de al menos 100 caracteres");
      return;
    }

    setTraining(true);
    try {
      const res = await fetch("/api/voice/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, articles: nonEmpty }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Voz entrenada exitosamente");
        setProfileName("");
        setArticles([""]);
        loadProfiles();
      } else {
        toast.error(data.error || "Error entrenando voz");
      }
    } catch {
      toast.error("Error entrenando voz");
    } finally {
      setTraining(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este perfil de voz?")) return;
    try {
      const res = await fetch(`/api/voice/profiles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Perfil eliminado");
        loadProfiles();
      }
    } catch {
      toast.error("Error eliminando perfil");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-400">Cargando perfiles...</div>;
  }

  return (
    <div className="space-y-5">
      {profiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Tus perfiles de voz</p>
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {p.sampleCount} artículo{p.sampleCount !== 1 ? "s" : ""} de muestra · {new Date(p.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-red-500 font-semibold hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleTrain} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del perfil</label>
          <Input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Ej: Cliente Tesla, Mi estilo personal"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">Artículos de muestra (1-5)</label>
            {articles.length < 5 && (
              <button
                type="button"
                onClick={addArticleField}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                + Agregar otro
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Pega artículos que hayas escrito tú. La IA analizará tu estilo para imitarlo. Mín. 100 caracteres cada uno.
          </p>
          <div className="space-y-3">
            {articles.map((article, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <textarea
                    value={article}
                    onChange={(e) => updateArticle(i, e.target.value)}
                    placeholder={`Pega aquí el texto del artículo ${i + 1}...`}
                    rows={4}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200 resize-y"
                  />
                  <p className="text-xs text-gray-400 mt-1">{article.length} caracteres</p>
                </div>
                {articles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArticleField(i)}
                    className="self-start px-2 py-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={training} isLoading={training}>
          {training ? "Analizando estilo..." : "Entrenar voz"}
        </Button>

        <p className="text-xs text-gray-400">
          La IA analizará tus artículos y extraerá tu estilo único: tono, vocabulario, ritmo y recursos retóricos. Luego podrás seleccionar esta voz al generar nuevos artículos.
        </p>
      </form>
    </div>
  );
}

interface ClientItem {
  id: string;
  name: string;
  companyType: string;
  defaultTone: string;
  defaultLanguage: string;
  articleCount: number;
  createdAt: string;
}

function ClientsSection({ subscriptionPlan }: { subscriptionPlan: string | null }) {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ClientItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("SaaS");
  const [formTone, setFormTone] = useState("professional");
  const [formLang, setFormLang] = useState("es");
  const [saving, setSaving] = useState(false);

  const loadClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const d = await res.json();
      if (d.success) setClients(d.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadClients(); }, []);

  const openNew = () => {
    setEditing(null);
    setFormName("");
    setFormType("SaaS");
    setFormTone("professional");
    setFormLang("es");
    setShowForm(true);
  };

  const openEdit = (c: ClientItem) => {
    setEditing(c);
    setFormName(c.name);
    setFormType(c.companyType);
    setFormTone(c.defaultTone);
    setFormLang(c.defaultLanguage);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { toast.error("El nombre es requerido"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/clients/${editing.id}` : "/api/clients";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, companyType: formType, defaultTone: formTone, defaultLanguage: formLang }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(editing ? "Cliente actualizado" : "Cliente creado");
        setShowForm(false);
        loadClients();
      } else {
        toast.error(d.error || "Error guardando cliente");
      }
    } catch {
      toast.error("Error guardando cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cliente? Los artículos no se eliminarán.")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) { toast.success("Cliente eliminado"); loadClients(); }
    } catch {
      toast.error("Error eliminando cliente");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          {SECTION_ICON("M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z")}
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Clientes</h2>
          <p className="text-xs text-gray-500">Gestiona los clientes de tu agencia</p>
        </div>
      </div>

      {!hasFeature(subscriptionPlan, "multiClient") ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-semibold text-amber-900 mb-2">Disponible en plan Pro o Agency</p>
          <p className="text-xs text-amber-700 mb-3">
            Sube de plan para gestionar múltiples clientes y generar artículos personalizados para cada uno.
          </p>
          <Link href="/credits">
            <button className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline">
              Ver planes de pago →
            </button>
          </Link>
        </div>
      ) : loading ? (
        <p className="text-sm text-gray-400">Cargando clientes...</p>
      ) : (
        <div className="space-y-3">
          {clients.length === 0 && !showForm && (
            <p className="text-sm text-gray-500 mb-4">Aún no tienes clientes creados. Al crear clientes, el generador autocompletará los datos de cada uno.</p>
          )}

          {clients.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {c.companyType} · Tono: {c.defaultTone} · {c.articleCount} artículo{c.articleCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(c)} className="text-xs text-brand-600 font-semibold hover:underline">Editar</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 font-semibold hover:underline">Eliminar</button>
              </div>
            </div>
          ))}

          {showForm && (
            <form onSubmit={handleSave} className="p-4 border-2 border-brand-100 bg-brand-50/30 rounded-xl space-y-4">
              <p className="text-sm font-semibold text-gray-900">{editing ? "Editar cliente" : "Nuevo cliente"}</p>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nombre del cliente" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ej: Prometeo Marketing" />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industria</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100">
                    {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tono por defecto</label>
                  <select value={formTone} onChange={(e) => setFormTone(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100">
                    {CONTENT_TONE_OPTIONS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Idioma por defecto</label>
                  <select value={formLang} onChange={(e) => setFormLang(e.target.value)} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100">
                    {LANGUAGE_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={saving} isLoading={saving}>{saving ? "Guardando..." : "Guardar cliente"}</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          )}

          {!showForm && (
            <button onClick={openNew} className="text-sm text-brand-600 font-semibold hover:underline">
              + Agregar cliente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
