"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    side: "left" as const,
    label: "IA Generativa",
    number: "01",
    title: "Artículos SEO listos en 30 segundos",
    body: "2.000+ palabras optimizadas, estructura H1-H3, keywords objetivo y meta description. Sin redactores, sin esperas.",
    accent: "#4f46e5",
    glow: "rgba(79,70,229,0.18)",
    gradBg: "rgba(238,240,255,0.65)",
  },
  {
    side: "right" as const,
    label: "Multi-formato",
    number: "02",
    title: "Descarga en el formato que necesites",
    body: "Markdown, HTML o Word con un clic. Entrega al cliente en su formato preferido sin perder el maquetado.",
    accent: "#0ea5e9",
    glow: "rgba(14,165,233,0.18)",
    gradBg: "rgba(224,242,254,0.65)",
  },
  {
    side: "left" as const,
    label: "WordPress",
    number: "03",
    title: "Publica directamente en WordPress",
    body: "Conecta el WordPress de tu cliente y publica con un clic. Imágenes, formato y metadatos incluidos.",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.18)",
    gradBg: "rgba(209,250,229,0.65)",
  },
  {
    side: "right" as const,
    label: "White-label",
    number: "04",
    title: "Tu marca. Tu negocio.",
    body: "Tus clientes nunca verán FeatSEO. Tu logo, tus colores, tu dominio. 100% personalizable.",
    accent: "#8b5cf6",
    glow: "rgba(139,92,246,0.18)",
    gradBg: "rgba(237,233,254,0.65)",
  },
];

export default function Article3DSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<() => void>();
  const [activeStep, setActiveStep] = useState(0);
  const [ready, setReady] = useState(false);

  const step = STEPS[activeStep];
  const isLeft = step.side === "left";
  const isRight = step.side === "right";

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;

    (async () => {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const THREE = await import("three");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const getSize = () => {
        const r = canvas.getBoundingClientRect();
        return { w: r.width || 480, h: r.height || 520 };
      };
      const { w, h } = getSize();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // ── Lighting ──────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));

      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(5, 6, 7);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0x818cf8, 0.5);
      fill.position.set(-6, -2, 4);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0xc7d2fe, 0.3);
      rim.position.set(0, -6, -5);
      scene.add(rim);

      // Orbiting shimmer point light — creates the "alive" feel on the paper
      const shimmer = new THREE.PointLight(0xa5b4fc, 2.2, 9);
      shimmer.position.set(3, 2, 4);
      scene.add(shimmer);

      // ── Particle cloud ────────────────────────────────────────
      const PARTICLE_COUNT = 90;
      const pPos = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 14;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 11;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3.5; // behind card
      }
      const pGeom = new THREE.BufferGeometry();
      pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x818cf8,
        size: 0.032,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.45,
      });
      const particles = new THREE.Points(pGeom, pMat);
      scene.add(particles);

      // ── Build the 3D Article card ─────────────────────────────
      const group = new THREE.Group();

      // Dropped shadow layer
      const dropShadow = new THREE.Mesh(
        new THREE.BoxGeometry(2.38, 3.08, 0.015),
        new THREE.MeshBasicMaterial({ color: 0xc7d2fe, transparent: true, opacity: 0.35 })
      );
      dropShadow.position.set(0.08, -0.08, -0.058);
      group.add(dropShadow);

      // Paper body
      const paper = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 3.0, 0.065),
        new THREE.MeshPhysicalMaterial({
          color: 0xfafbff,
          roughness: 0.05,
          metalness: 0.0,
          side: THREE.DoubleSide,
        })
      );
      group.add(paper);

      const backPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 3.0),
        new THREE.MeshBasicMaterial({ color: 0xf1f5f9, side: THREE.BackSide })
      );
      backPlane.position.z = -0.033;
      group.add(backPlane);

      // Helper: flat rect on front face
      const addRect = (rw: number, rh: number, rx: number, ry: number, color: number, opacity = 1) => {
        const mat = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(rw, rh, 0.006), mat);
        mesh.position.set(rx, ry, 0.036);
        group.add(mesh);
      };

      // Header bar
      addRect(2.3, 0.52, 0, 1.24, 0x4f46e5);
      addRect(1.55, 0.072, -0.2, 1.36, 0xffffff, 0.9);
      addRect(1.0, 0.055, -0.45, 1.22, 0xa5b4fc, 0.8);
      addRect(0.38, 0.165, 0.82, 1.25, 0x6366f1);

      // Category / date row
      addRect(0.58, 0.1, -0.7, 0.84, 0xede9fe);
      addRect(0.28, 0.065, 0.78, 0.84, 0xe2e8f0);

      // Article title
      addRect(1.88, 0.092, 0.0, 0.64, 0x1e293b);
      addRect(1.42, 0.082, -0.22, 0.52, 0x1e293b);

      // Body text lines
      const bodyLines: [number, number][] = [
        [1.92, 0.32], [1.76, 0.20], [1.92, 0.08],
        [1.5, -0.04], [1.92, -0.16], [1.82, -0.28], [1.2, -0.40],
      ];
      bodyLines.forEach(([lw, ly]) =>
        addRect(lw, 0.058, -(1.92 - lw) / 2, ly, 0x94a3b8)
      );

      // Divider
      addRect(1.92, 0.012, 0, -0.55, 0xe2e8f0);

      // Image placeholder
      addRect(0.88, 0.58, -0.45, -0.86, 0xede9fe);
      addRect(0.28, 0.28, -0.45, -0.86, 0xc7d2fe, 0.7);

      // Stats column
      addRect(0.68, 0.115, 0.78, -0.67, 0xf8faff);
      addRect(0.48, 0.08, 0.78, -0.84, 0xe0e7ff);
      addRect(0.58, 0.08, 0.78, -0.98, 0xede9fe);

      // Footer
      addRect(1.92, 0.012, 0, -1.27, 0xe2e8f0);
      addRect(0.72, 0.058, -0.55, -1.38, 0xcbd5e1);
      addRect(0.3, 0.058, 0.75, -1.38, 0x4f46e5);

      group.rotation.x = 0.08;

      // ── ENTRANCE ANIMATION — card flies in from below ─────────
      group.position.y = -5.5;
      group.scale.set(0.35, 0.35, 0.35);
      group.rotation.x = 0.55;

      gsap.to(group.position, { y: 0, duration: 1.5, ease: "back.out(1.5)", delay: 0.15 });
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.5)", delay: 0.15 });
      gsap.to(group.rotation, { x: 0.08, duration: 1.5, ease: "back.out(1.5)", delay: 0.15 });

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

      // ── Idle float (starts after entrance) ───────────────────
      const floatTween = gsap.to(group.position, {
        y: 0.15,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.7,
      });

      // ── Render loop ───────────────────────────────────────────
      const clock = new THREE.Clock();

      const tick = () => {
        animId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();

        // Smooth scroll rotation
        currentRotation += (target.rotation - currentRotation) * 0.055;
        group.rotation.y = currentRotation;

        // Orbiting shimmer light
        shimmer.position.x = Math.sin(t * 0.55) * 3.8;
        shimmer.position.y = Math.cos(t * 0.38) * 2.6;
        shimmer.position.z = 3.5 + Math.sin(t * 0.28) * 1.8;

        // Slowly drift particles
        particles.rotation.y += 0.00075;
        particles.rotation.x += 0.0003;

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
        pGeom.dispose();
        pMat.dispose();
      };
    })();

    return () => {
      cancelAnimationFrame(animId!);
      cleanupRef.current?.();
    };
  }, []);

  // ── Text panel (re-mounts on step change for blur-in animation) ──
  const TextPanel = ({ dir }: { dir: "left" | "right" }) => (
    <div
      key={`${dir}-${activeStep}`}
      style={{ animation: "stepTextIn 0.52s cubic-bezier(0.16,1,0.3,1) forwards" }}
    >
      {/* Step number — large decorative */}
      <span
        className="block font-black leading-none mb-2 select-none"
        style={{
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
          color: `${step.accent}14`,
          letterSpacing: "-0.04em",
        }}
      >
        {step.number}
      </span>

      {/* Label chip */}
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border"
        style={{
          color: step.accent,
          backgroundColor: `${step.accent}12`,
          borderColor: `${step.accent}35`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: step.accent }}
        />
        {step.label}
      </span>

      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
        {step.title}
      </h3>
      <p className="text-gray-500 leading-relaxed text-[15px]">{step.body}</p>
    </div>
  );

  return (
    <>
      {/* Keyframe injected inline to avoid globals dependency */}
      <style>{`
        @keyframes stepTextIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    filter: blur(0);  }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.06); }
        }
      `}</style>

      <section ref={containerRef} className="relative" style={{ height: "320vh" }}>
        {/* ── Sticky viewport ── */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

          {/* Base background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f8f9ff] to-white" />

          {/* Per-step color gradient overlays — fade between them */}
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{
                background: `radial-gradient(ellipse 85% 60% at 50% 48%, ${s.gradBg} 0%, transparent 72%)`,
                opacity: activeStep === i ? 1 : 0,
              }}
            />
          ))}

          {/* Scroll-progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-20">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${(activeStep + 1) * 25}%`,
                background: `linear-gradient(90deg, ${STEPS[0].accent}, ${step.accent})`,
              }}
            />
          </div>

          {/* Section label */}
          <div className="relative z-10 text-center mb-5 mt-6">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-1">
              Cómo funciona
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Todo en un solo flujo
            </h2>
          </div>

          {/* ── 3-column grid ── */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center pb-10">

            {/* Left text panel */}
            <div className="hidden md:block pr-6">
              {isLeft && <TextPanel dir="left" />}
            </div>

            {/* Canvas with glow ring */}
            <div className="relative flex items-center justify-center">
              {/* Per-step glow overlays */}
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className="absolute rounded-3xl pointer-events-none transition-opacity duration-700"
                  style={{
                    inset: "-28px",
                    background: `radial-gradient(ellipse at center, ${s.glow}, transparent 68%)`,
                    filter: "blur(18px)",
                    animation: activeStep === i ? "glowPulse 3s ease-in-out infinite" : "none",
                    opacity: activeStep === i ? 1 : 0,
                  }}
                />
              ))}

              <canvas
                ref={canvasRef}
                className="relative block"
                style={{
                  width: "min(340px, 90vw)",
                  height: "min(480px, 58vh)",
                  opacity: ready ? 1 : 0,
                  transition: "opacity 0.7s ease",
                  touchAction: "none",
                }}
              />
            </div>

            {/* Right text panel */}
            <div className="hidden md:block pl-6">
              {isRight && <TextPanel dir="right" />}
            </div>

            {/* Mobile text */}
            <div className="md:hidden text-center px-2 -mt-2">
              <TextPanel dir="left" />
            </div>
          </div>

          {/* ── Step indicators ── */}
          <div className="relative z-10 flex items-center gap-3 pb-6">
            {STEPS.map((s, i) => (
              <div key={i} className="relative flex items-center justify-center" style={{ height: 20 }}>
                {/* Ping ring on active */}
                {activeStep === i && (
                  <span
                    className="absolute rounded-full animate-ping"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: s.accent,
                      opacity: 0.35,
                    }}
                  />
                )}
                <div
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: activeStep === i ? 30 : 8,
                    height: 8,
                    backgroundColor: activeStep === i ? s.accent : "#e2e8f0",
                    boxShadow: activeStep === i ? `0 0 10px ${s.accent}55` : "none",
                    transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), background-color 0.4s, box-shadow 0.4s",
                  }}
                />
              </div>
            ))}

            {/* Step counter */}
            <span className="ml-3 text-xs text-gray-400 font-medium tabular-nums">
              {activeStep + 1} / {STEPS.length}
            </span>
          </div>

          {/* Scroll hint */}
          <div
            className="absolute bottom-5 right-6 flex items-center gap-1.5 text-xs text-gray-400 transition-opacity duration-500"
            style={{ opacity: activeStep === STEPS.length - 1 ? 0 : 0.8 }}
          >
            <span>Sigue bajando</span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
