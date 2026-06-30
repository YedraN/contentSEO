"use client";

import { useState, useEffect } from "react";

const TITLE = "10 Estrategias de Email Marketing para E-commerce en 2025";
const CONTENT =
  "El email marketing sigue siendo uno de los canales con mayor retorno sobre la inversión en el sector del e-commerce. En esta guía analizamos las 10 estrategias más efectivas que las mejores agencias aplican para sus clientes este año, incluyendo automatizaciones, segmentación avanzada y personalización a escala.";
const KEYWORDS = ["email marketing", "e-commerce", "ROI agencia"];

type Phase = "waiting" | "title" | "loading" | "content" | "done";

export default function ArticleGenerationPreview() {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [titleText, setTitleText] = useState("");
  const [contentText, setContentText] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let iv: ReturnType<typeof setInterval>;

    const startCycle = () => {
      setPhase("waiting");
      setTitleText("");
      setContentText("");
      setProgress(0);

      t1 = setTimeout(() => {
        setPhase("title");
        let i = 0;
        iv = setInterval(() => {
          i++;
          setTitleText(TITLE.slice(0, i));
          if (i >= TITLE.length) {
            clearInterval(iv);
            setPhase("loading");
            let p = 0;
            iv = setInterval(() => {
              p += 3;
              setProgress(Math.min(p, 100));
              if (p >= 100) {
                clearInterval(iv);
                setPhase("content");
                let j = 0;
                iv = setInterval(() => {
                  j += 5;
                  setContentText(CONTENT.slice(0, j));
                  if (j >= CONTENT.length) {
                    clearInterval(iv);
                    setPhase("done");
                    t1 = setTimeout(startCycle, 3500);
                  }
                }, 18);
              }
            }, 22);
          }
        }, 32);
      }, 700);
    };

    startCycle();
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, []);

  return (
    <div className="relative w-full max-w-[440px] mx-auto lg:mx-0">
      {/* Ambient glow */}
      <div className="absolute -inset-6 bg-indigo-500/15 rounded-3xl blur-3xl pointer-events-none" />
      <div className="absolute -inset-2 bg-indigo-600/8 rounded-2xl blur-xl pointer-events-none" />

      {/* Card */}
      <div className="relative bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
        {/* Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0D1321] border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-md flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-black">F</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">FeatSEO · Editor</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5">
            {KEYWORDS.map((kw) => (
              <span
                key={kw}
                className="text-[11px] px-2 py-0.5 bg-indigo-500/15 text-indigo-300 rounded-full border border-indigo-500/25 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>

          {/* Title */}
          <div className="min-h-[52px]">
            <p className="text-[13px] font-bold text-white leading-snug">
              {titleText || (
                <span className="text-slate-600">Título del artículo...</span>
              )}
              {phase === "title" && (
                <span className="inline-block w-[2px] h-3.5 bg-indigo-400 ml-0.5 align-middle animate-pulse" />
              )}
            </p>
          </div>

          {/* Progress bar */}
          {(phase === "loading" || phase === "content" || phase === "done") && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-500">
                  {phase === "done" ? "Artículo generado" : "Generando contenido…"}
                </span>
                <span className="text-[11px] font-semibold text-slate-300 tabular-nums">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Content preview */}
          {(phase === "content" || phase === "done") && (
            <div className="border-t border-white/[0.06] pt-3">
              <p className="text-[11px] text-slate-400 leading-relaxed min-h-[60px]">
                {contentText}
                {phase === "content" && (
                  <span className="inline-block w-[2px] h-3 bg-slate-500 ml-0.5 align-middle animate-pulse" />
                )}
              </p>
            </div>
          )}

          {/* Meta row */}
          {(phase === "content" || phase === "done") && (
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                2.340 palabras
              </span>
              <span>·</span>
              <span>Tono profesional</span>
              <span>·</span>
              <span>Español</span>
            </div>
          )}
        </div>

        {/* WordPress published badge */}
        {phase === "done" && (
          <div className="px-5 pb-5 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">Publicado en WordPress</span>
              <span className="ml-auto text-[10px] text-emerald-700">hace 2s</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating badges */}
      <div className="absolute -left-6 top-1/3 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 shadow-xl hidden lg:flex items-center gap-2">
        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-white">Voz entrenada</p>
          <p className="text-[9px] text-slate-500">Estilo del cliente</p>
        </div>
      </div>

      <div className="absolute -right-4 bottom-1/4 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 shadow-xl hidden lg:flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-white">Multi-cliente</p>
          <p className="text-[9px] text-slate-500">14 cuentas activas</p>
        </div>
      </div>
    </div>
  );
}
