"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mobile hero background video (owner request 2026-08-01). Real footage of
 * completed roofs, layered OVER the hero photograph rather than replacing it.
 *
 * Everything here is designed so the hero is never worse than it is today:
 *
 *  • The photo underneath stays the LCP element and keeps its priority load.
 *    The video carries preload="none" and gets its src only after mount, so it
 *    cannot compete for bandwidth during first paint.
 *  • It plays ONCE and fades back to the photo. The clip opens on a grey roof
 *    over green lawn and ends on a tan roof under cloud — looping would hard-cut
 *    between the two. One pass also stops burning battery on a page someone may
 *    sit on while they read.
 *  • It is skipped entirely on desktop (the clip is 9:16), when the viewer
 *    prefers reduced motion, on Save-Data, and on 2G/3G. Roofing customers read
 *    this page on cellular in rural Mississippi; 1.3MB is not worth forcing on
 *    a slow connection.
 *
 * If any of that fails, nothing renders and the hero is exactly the hero.
 */

/** WebM first (smaller on Chrome/Android), H.264 for Safari and iOS. */
const SOURCES = [
  { src: "/videos/hero-roof-recap.webm", type: "video/webm" },
  { src: "/videos/hero-roof-recap.mp4", type: "video/mp4" },
];

interface NetworkInfo {
  saveData?: boolean;
  effectiveType?: string;
}

/** Cheap enough connection to spend ~1.3MB on decoration? */
function connectionAllows(): boolean {
  const nav = navigator as Navigator & { connection?: NetworkInfo };
  const c = nav.connection;
  if (!c) return true; // unknown (Safari) — assume fine
  if (c.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(c.effectiveType ?? "");
}

export function HeroVideo() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const isPhone = window.matchMedia("(max-width: 1023px)").matches;
    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;
    if (!isPhone || !motionOk || !connectionAllows()) return;

    // One frame after mount, so the photo has already been handed to the
    // browser and the video never races it.
    const id = window.setTimeout(() => setShow(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!show) return null;

  return (
    <video
      // Mounted only after the gate passes, so first paint is long done and
      // letting it preload here costs the photo nothing. (preload="none" is a
      // dead end: canplay never fires, so nothing ever starts.)
      ref={(el) => {
        ref.current = el;
        // Kick playback ourselves — this is what triggers the load.
        el?.play()
          .then(() => setVisible(true))
          // Refused (low-power mode, browser policy) — stay on the photo.
          .catch(() => setShow(false));
      }}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onEnded={() => setVisible(false)}
      onError={() => setShow(false)}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-out lg:hidden ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {SOURCES.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
