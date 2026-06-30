"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { COMPANY_TYPES, CONTENT_TONE_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/prompts";
import toast from "react-hot-toast";
import { classNames } from "@/lib/utils";

interface VoiceProfileOption {
  id: string;
  name: string;
  sampleCount: number;
}

interface ClientOption {
  id: string;
  name: string;
  companyType: string;
  defaultTone: string;
  defaultLanguage: string;
}

interface GeneratedArticleStub {
  id: string;
  title: string;
  createdAt: Date;
}

interface JobStatus {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  totalItems: number;
  doneItems: number;
  error?: string | null;
  articles?: GeneratedArticleStub[];
}

interface GeneratorFormProps {
  onSuccess?: (articles: any[]) => void;
}

export default function GeneratorForm({ onSuccess }: GeneratorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState<JobStatus | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfileOption[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "SaaS",
    keywords: [] as string[],
    keywordInput: "",
    tone: "professional" as "professional" | "casual" | "technical" | "friendly",
    numArticles: 1,
    language: "es",
    voiceProfileId: "",
    clientId: "",
  });

  const loadClient = useCallback(async (clientId: string) => {
    if (!clientId) return;
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const d = await res.json();
      if (d.success && d.data) {
        setFormData((prev) => ({
          ...prev,
          clientId,
          companyName: d.data.name,
          companyType: d.data.companyType,
          tone: d.data.defaultTone as any,
          language: d.data.defaultLanguage,
        }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const prefs = localStorage.getItem("featseo_prefs");
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setFormData((prev) => ({
          ...prev,
          language: parsed.defaultLanguage ?? prev.language,
          tone: parsed.defaultTone ?? prev.tone,
        }));
      }
    } catch {}

    fetch("/api/voice/profiles")
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setVoiceProfiles(d.data); })
      .catch(() => {});

    fetch("/api/clients")
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setClients(d.data); })
      .catch(() => {});
  }, []);

  // ── Polling logic ────────────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/generate/jobs/${jobId}`);
          const data = await res.json();
          if (!data.success) { stopPolling(); return; }

          const jobData: JobStatus = data.data;
          setJob(jobData);

          if (jobData.status === "completed") {
            stopPolling();
            setIsSubmitting(false);
            toast.success(
              `${jobData.doneItems} artículo${jobData.doneItems !== 1 ? "s" : ""} generado${jobData.doneItems !== 1 ? "s" : ""} correctamente`
            );
            if (onSuccess && jobData.articles) {
              onSuccess(jobData.articles);
            }
            // Reset form
            setFormData((prev) => ({
              ...prev,
              companyName: "",
              keywords: [],
              keywordInput: "",
              numArticles: 1,
            }));
            // Clear job display after a short delay
            setTimeout(() => setJob(null), 3000);
          } else if (jobData.status === "failed") {
            stopPolling();
            setIsSubmitting(false);
            toast.error(jobData.error ?? "Error generando artículos");
            setTimeout(() => setJob(null), 5000);
          }
        } catch {
          // Network error — keep polling
        }
      }, 1500);
    },
    [stopPolling, onSuccess]
  );

  // Cleanup on unmount
  useEffect(() => () => stopPolling(), [stopPolling]);

  // ── Form handlers ────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numArticles" ? parseInt(value) : value,
    }));
  };

  const addKeyword = () => {
    const keyword = formData.keywordInput.trim();
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, keyword], keywordInput: "" }));
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("El nombre de la empresa es requerido");
      return;
    }
    if (formData.keywords.length === 0) {
      toast.error("Debes agregar al menos una palabra clave");
      return;
    }

    setIsSubmitting(true);
    setJob(null);

    try {
      const response = await fetch("/api/generate/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          companyType: formData.companyType,
          keywords: formData.keywords,
          tone: formData.tone,
          numArticles: formData.numArticles,
          language: formData.language,
          voiceProfileId: formData.voiceProfileId || undefined,
          clientId: formData.clientId || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || "Error iniciando la generación");
        setIsSubmitting(false);
        return;
      }

      // 202 Accepted — job was created, start polling
      const { jobId, totalItems } = data.data;
      setJob({ id: jobId, status: "queued", progress: 0, totalItems, doneItems: 0 });
      startPolling(jobId);
    } catch {
      toast.error("Error de conexión");
      setIsSubmitting(false);
    }
  };

  const selectedLanguageLabel =
    LANGUAGE_OPTIONS.find((l) => l.value === formData.language)?.label ?? formData.language;

  const isProcessing = isSubmitting || (job !== null && job.status !== "completed" && job.status !== "failed");

  // ── Progress display ─────────────────────────────────────────────────────
  const progressLabel =
    job?.status === "queued"
      ? "En cola…"
      : job?.status === "running"
      ? job.doneItems > 0
        ? `Generando artículo ${job.doneItems + 1} de ${job.totalItems}…`
        : "Iniciando generación…"
      : job?.status === "completed"
      ? `${job.doneItems} artículo${job.doneItems !== 1 ? "s" : ""} completados`
      : job?.status === "failed"
      ? "Error en la generación"
      : `Generando ${formData.numArticles} artículo${formData.numArticles > 1 ? "s" : ""}…`;

  return (
    <Card hover padding="lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-600/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Generar Artículos SEO</h2>
          <p className="text-sm text-gray-500">Completa los campos para generar contenido optimizado</p>
        </div>
      </div>

      {/* ── Progress bar (shown while job is active) ───────────────────────── */}
      {job && (
        <div className={classNames(
          "mb-6 p-4 rounded-xl border transition-all",
          job.status === "failed"
            ? "bg-red-50 border-red-200"
            : job.status === "completed"
            ? "bg-green-50 border-green-200"
            : "bg-brand-50 border-brand-200"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className={classNames(
              "text-sm font-semibold",
              job.status === "failed" ? "text-red-700" : job.status === "completed" ? "text-green-700" : "text-brand-700"
            )}>
              {progressLabel}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {job.status === "running" || job.status === "completed"
                ? `${job.doneItems}/${job.totalItems}`
                : ""}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-gray-200">
            <div
              className={classNames(
                "h-2 rounded-full transition-all duration-700 ease-out",
                job.status === "failed"
                  ? "bg-red-500"
                  : job.status === "completed"
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-brand-500 to-brand-600"
              )}
              style={{ width: `${job.status === "queued" ? 5 : job.progress}%` }}
            />
          </div>
          {job.status === "failed" && job.error && (
            <p className="text-xs text-red-600 mt-2">{job.error}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {clients.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cliente</label>
            <select
              value={formData.clientId}
              onChange={(e) => loadClient(e.target.value)}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200 disabled:opacity-60"
            >
              <option value="">Sin cliente (escribe manualmente)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Nombre de la empresa"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Ej: Tech Solutions"
            required
            disabled={isProcessing}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de empresa</label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleInputChange}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200 disabled:opacity-60"
            >
              {COMPANY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Palabras clave</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={formData.keywordInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, keywordInput: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
              placeholder="Escribe una palabra clave y presiona Enter"
              disabled={isProcessing}
            />
            <Button type="button" variant="secondary" onClick={addKeyword} disabled={isProcessing} className="whitespace-nowrap shrink-0">
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  disabled={isProcessing}
                  className="w-4 h-4 rounded-full bg-brand-200 hover:bg-brand-300 flex items-center justify-center text-brand-700 text-xs transition-colors disabled:opacity-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Idioma del artículo</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200 disabled:opacity-60"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tono del contenido</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleInputChange}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200 disabled:opacity-60"
            >
              {CONTENT_TONE_OPTIONS.map((tone) => (
                <option key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Número de artículos
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, numArticles: n }))}
                  disabled={isProcessing}
                  className={classNames(
                    "w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50",
                    formData.numArticles === n
                      ? "bg-brand-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {voiceProfiles.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Voz del autor</label>
            <select
              value={formData.voiceProfileId}
              onChange={(e) => setFormData((prev) => ({ ...prev, voiceProfileId: e.target.value }))}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all duration-200 disabled:opacity-60"
            >
              <option value="">Estilo predeterminado</option>
              {voiceProfiles.map((vp) => (
                <option key={vp.id} value={vp.id}>
                  {vp.name} ({vp.sampleCount} artículo{vp.sampleCount !== 1 ? "s" : ""})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5">
              Elige un perfil de voz entrenado para que la IA imite ese estilo
            </p>
          </div>
        )}

        <div className={classNames(
          "p-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100",
          isProcessing && "opacity-60"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Resumen</span>
            <span className="text-xs text-gray-500">1 crédito por artículo</span>
          </div>
          <p className="text-sm text-gray-600">
            {formData.keywords.length} palabra(s) clave · {selectedLanguageLabel} · Tono {formData.tone} · {formData.numArticles} artículo(s)
          </p>
        </div>

        <Button
          type="submit"
          isLoading={isProcessing}
          disabled={isProcessing || formData.keywords.length === 0}
          className="w-full text-base py-3"
        >
          {isProcessing
            ? progressLabel
            : `Generar ${formData.numArticles} artículo${formData.numArticles > 1 ? "s" : ""}`}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          La generación ocurre en segundo plano — puedes navegar mientras esperas
        </p>
      </form>
    </Card>
  );
}
