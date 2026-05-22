"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    side: "left" as const,
    label: "IA Generativa",
    title: "Artículos SEO listos en 30 segundos",
    body: "2.000+ palabras optimizadas, estructura H1-H3, keywords objetivo y meta description. Sin redactores, sin esperas.",
  },
  {
    side: "right" as const,
    label: "Multi-formato",
    title: "Descarga en el formato que necesites",
    body: "Markdown, HTML o Word con un clic. Entrega al cliente en su formato preferido sin perder el maquetado.",
  },
  {
    side: "left" as const,
    label: "WordPress",
    title: "Publica directamente en WordPress",
    body: "Conecta el WordPress de tu cliente y publica con un clic. Imágenes, formato y metadatos incluidos.",
  },
  {
    side: "right" as const,
    label: "White-label",
    title: "Tu marca. Tu negocio.",
    body: "Tus clientes nunca verán FeatSEO. Tu logo, tus colores, tu dominio. 100% personalizable.",
  },
];

export default function Article3DSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<() => void>();
  const [activeStep, setActiveStep] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;

    (async () => {
      // Wait one frame so the canvas has real layout dimensions
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const THREE = await import("three");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ── Size helpers ──────────────────────────────────────────
      const getSize = () => {
        const r = canvas.getBoundingClientRect();
        return { w: r.width || 480, h: r.height || 520 };
      };
      const { w, h } = getSize();

      // ── Scene / Camera / Renderer ─────────────────────────────
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // ── Lighting ──────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.65));

      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(5, 6, 7);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0x818cf8, 0.45);
      fill.position.set(-6, -2, 4);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0xc7d2fe, 0.25);
      rim.position.set(0, -6, -5);
      scene.add(rim);

      // ── Build the 3D Article ──────────────────────────────────
      const group = new THREE.Group();

      // Dropped shadow layer
      const dropShadow = new THREE.Mesh(
        new THREE.BoxGeometry(2.38, 3.08, 0.015),
        new THREE.MeshBasicMaterial({ color: 0xc7d2fe, transparent: true, opacity: 0.4 })
      );
      dropShadow.position.set(0.07, -0.07, -0.055);
      group.add(dropShadow);

      // Paper body (front + back via DoubleSide)
      const paper = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 3.0, 0.065),
        new THREE.MeshPhysicalMaterial({
          color: 0xfafbff,
          roughness: 0.06,
          metalness: 0.0,
          side: THREE.DoubleSide,
        })
      );
      group.add(paper);

      // Back-face overlay (slightly off-white lines to suggest ruled paper)
      const backPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 3.0),
        new THREE.MeshBasicMaterial({ color: 0xf1f5f9, side: THREE.BackSide })
      );
      backPlane.position.z = -0.033;
      group.add(backPlane);

      // Helper: add a flat rect on the FRONT face
      const addRect = (rw: number, rh: number, rx: number, ry: number, color: number, opacity = 1) => {
        const mat = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(rw, rh, 0.006), mat);
        mesh.position.set(rx, ry, 0.036);
        group.add(mesh);
      };

      // ── Header bar ─────────────────────────────────────────────
      addRect(2.3, 0.52, 0, 1.24, 0x4f46e5);           // main purple bar
      addRect(1.55, 0.072, -0.2, 1.36, 0xffffff, 0.9);  // title white line
      addRect(1.0, 0.055, -0.45, 1.22, 0xa5b4fc, 0.8);  // subtitle
      addRect(0.38, 0.165, 0.82, 1.25, 0x6366f1);        // badge

      // ── Category / date row ────────────────────────────────────
      addRect(0.58, 0.1, -0.7, 0.84, 0xede9fe);  // category chip
      addRect(0.28, 0.065, 0.78, 0.84, 0xe2e8f0); // date chip

      // ── Article title (dark lines) ─────────────────────────────
      addRect(1.88, 0.092, 0.0, 0.64, 0x1e293b);
      addRect(1.42, 0.082, -0.22, 0.52, 0x1e293b);

      // ── Body text (gray lines) ─────────────────────────────────
      const bodyLines: [number, number][] = [
        [1.92, 0.32], [1.76, 0.20], [1.92, 0.08],
        [1.5, -0.04],  [1.92, -0.16], [1.82, -0.28], [1.2, -0.40],
      ];
      bodyLines.forEach(([lw, ly]) =>
        addRect(lw, 0.058, -(1.92 - lw) / 2, ly, 0x94a3b8)
      );

      // ── Divider ────────────────────────────────────────────────
      addRect(1.92, 0.012, 0, -0.55, 0xe2e8f0);

      // ── Image placeholder ──────────────────────────────────────
      addRect(0.88, 0.58, -0.45, -0.86, 0xede9fe);
      addRect(0.28, 0.28, -0.45, -0.86, 0xc7d2fe, 0.7); // icon inside

      // ── Stats column ───────────────────────────────────────────
      addRect(0.68, 0.115, 0.78, -0.67, 0xf8faff);
      addRect(0.48, 0.08, 0.78, -0.84, 0xe0e7ff);
      addRect(0.58, 0.08, 0.78, -0.98, 0xede9fe);

      // ── Footer ─────────────────────────────────────────────────
      addRect(1.92, 0.012, 0, -1.27, 0xe2e8f0);
      addRect(0.72, 0.058, -0.55, -1.38, 0xcbd5e1);
      addRect(0.3, 0.058, 0.75, -1.38, 0x4f46e5);

      group.rotation.x = 0.08; // subtle forward tilt
      scene.add(group);

      // ── Scroll-driven rotation ────────────────────────────────
      const target = { rotation: 0 };
      let currentRotation = 0;
      let lastStep = 0;

      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          target.rotation = self.progress * Math.PI * 2;
          const newStep = Math.min(3, Math.floor(self.progress * 4));
          if (newStep !== lastStep) {
            lastStep = newStep;
            setActiveStep(newStep);
          }
        },
      });

      // ── Idle float ────────────────────────────────────────────
      const floatTween = gsap.to(group.position, {
        y: 0.14,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Render loop ───────────────────────────────────────────
      const tick = () => {
        animId = requestAnimationFrame(tick);
        // Smooth rotation lerp
        currentRotation += (target.rotation - currentRotation) * 0.055;
        group.rotation.y = currentRotation;
        renderer.render(scene, camera);
      };
      tick();

      // ── Resize ────────────────────────────────────────────────
      const onResize = () => {
        const { w: nw, h: nh } = getSize();
        if (nw < 1 || nh < 1) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh, false);
      };
      window.addEventListener("resize", onResize);

      setReady(true);

      cleanupRef.current = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        floatTween.kill();
        st.kill();
        renderer.dispose();
      };
    })();

    return () => {
      cancelAnimationFrame(animId!);
      cleanupRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = STEPS[activeStep];
  const isLeft = step.side === "left";
  const isRight = step.side === "right";

  const TextContent = () => (
    <>
      <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-50 border border-brand-200 rounded-full mb-4">
        {step.label}
      </span>
      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
        {step.title}
      </h3>
      <p className="text-gray-500 leading-relaxed">{step.body}</p>
    </>
  );

  return (
    <section ref={containerRef} className="relative" style={{ height: "320vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-brand-50/15 to-white">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-100/20 rounded-full blur-3xl" />
        </div>

        {/* Section label */}
        <div className="relative z-10 text-center mb-6 mt-4">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-1">Cómo funciona</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Todo en un solo flujo</h2>
        </div>

        {/* 3-column grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center pb-12">

          {/* Left text panel */}
          <div className="hidden md:flex flex-col justify-center pr-6">
            <div
              className="transition-all duration-500"
              style={{
                opacity: isLeft ? 1 : 0,
                transform: isLeft ? "translateX(0)" : "translateX(-24px)",
                pointerEvents: isLeft ? "auto" : "none",
              }}
            >
              <TextContent />
            </div>
          </div>

          {/* Three.js canvas */}
          <div className="flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="block"
              style={{
                width: "min(340px, 90vw)",
                height: "min(480px, 58vh)",
                opacity: ready ? 1 : 0,
                transition: "opacity 0.6s ease",
                touchAction: "none",
              }}
            />
          </div>

          {/* Right text panel */}
          <div className="hidden md:flex flex-col justify-center pl-6">
            <div
              className="transition-all duration-500"
              style={{
                opacity: isRight ? 1 : 0,
                transform: isRight ? "translateX(0)" : "translateX(24px)",
                pointerEvents: isRight ? "auto" : "none",
              }}
            >
              <TextContent />
            </div>
          </div>

          {/* Mobile text (below canvas) */}
          <div className="md:hidden text-center px-2 -mt-2">
            <TextContent />
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="relative z-10 flex items-center gap-2 pb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeStep === i ? 28 : 8,
                height: 8,
                backgroundColor: activeStep === i ? "#4f46e5" : "#e2e8f0",
              }}
            />
          ))}
        </div>

        {/* Scroll hint arrow */}
        <div
          className="absolute bottom-5 right-6 flex items-center gap-1.5 text-xs text-gray-400 transition-opacity duration-500"
          style={{ opacity: activeStep === 3 ? 0 : 1 }}
        >
          <span>Sigue bajando</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
