"use client";

import { useEffect, useRef } from "react";

/**
 * Snow, on a canvas.
 *
 * Rules this obeys, because decorative motion must never cost usability:
 *   - Desktop only. Disabled below 1024px, where it would burn battery and
 *     compete with the sticky action bar for paint budget.
 *   - Off entirely under prefers-reduced-motion.
 *   - Pauses when the tab is hidden.
 *   - Pointer-events none, sits behind content, aria-hidden.
 *
 * Canvas rather than DOM nodes: 55 animated elements would thrash layout,
 * one canvas does not.
 */
export function Snowfall({ density = 55 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (reduced.matches || !desktop.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    type Flake = {
      x: number;
      y: number;
      r: number;
      speed: number;
      drift: number;
      phase: number;
    };
    let flakes: Flake[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      flakes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.7 + Math.random() * 1.9,
        speed: 12 + Math.random() * 26,
        drift: 6 + Math.random() * 16,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    let last = performance.now();
    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.55)";

      for (const flake of flakes) {
        flake.y += flake.speed * dt;
        flake.phase += dt;
        const x = flake.x + Math.sin(flake.phase) * flake.drift;

        if (flake.y - flake.r > height) {
          flake.y = -flake.r;
          flake.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
    />
  );
}
