"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

export function AnimationsWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("animate-in")) {
          entry.target.classList.add("animate-in");

          const animation = entry.target.getAttribute("data-animation");
          if (animation === "fade-up") {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 600,
              easing: "easeOutQuad",
            });
          } else if (animation === "fade-left") {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateX: [-30, 0],
              duration: 600,
              easing: "easeOutQuad",
            });
          }
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
