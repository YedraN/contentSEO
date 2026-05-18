"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

export function useAnime(
  params: anime.AnimeParams,
  deps: unknown[] = []
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = anime({ targets: ref.current, ...params });
    return () => instance.pause();
  }, deps);

  return ref;
}

export function useStaggerFade(
  selector: string,
  delay = 100,
  offset = 0
) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const instance = anime({
      targets: els,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(delay, { start: offset }),
      easing: "easeOutCubic",
    });
    return () => instance.pause();
  }, []);
}

export function fadeInUp(duration = 600) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: duration / 1000, ease: "easeOut" } },
  } as const;
}

export function scaleIn(duration = 400) {
  return {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: duration / 1000, ease: "easeOut" } },
  } as const;
}
