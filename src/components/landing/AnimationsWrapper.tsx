"use client";

import { useEffect, useRef } from "react";

export function AnimationsWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("animate-in")) {
          entry.target.classList.add("animate-in");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    containerRef.current.querySelectorAll("[data-animation]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
