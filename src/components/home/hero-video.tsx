"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mobile hero background video (owner request 2026-08-01), layered OVER the
 * hero photograph rather than replacing it.
 *
 * CURRENT CLIP: GAF shingle-colour footage from the manufacturer's contractor
 * marketing library — we are a GAF certified contractor showing GAF products we
 * install. It is decorative and unlabelled, so it never reads as a claim about
 * our own job sites; that promise ("no stock photography pretends to be our
 * work") belongs to the project gallery, which remains 100% our own photos.
 * TO REPLACE (owner plans to, once his drone arrives): drop new files at
 * public/videos/hero-background.{webm,mp4}. Nothing else needs touching.
 *
 * Everything here is designed so the hero is never worse than it is without it:
 *
 *  • The photo underneath stays the LCP element and keeps its priority load.
 *    The video mounts 400ms after paint, so it cannot compete for bandwidth
 *    during first render.
 *  • It loops. Every transition in this clip is already a cut between different
 *    roofs, so the seam back to the first frame reads like any other. (A clip
 *    with a narrative arc should play once and fade out instead — see git
 *    history for that variant.)
 *  • It is skipped entirely on desktop (the clip is 9:16), when the viewer
 *    prefers reduced motion, on Save-Data, and on 2G/3G. Roofing customers read
 *    this page on cellular in rural Mississippi; ~1.5MB is not worth forcing on
 *    a slow connection.
 *
 * If any of that fails, nothing renders and the hero is exactly the hero.
 */

/**
 * H.264 FIRST, deliberately. VP9 is usually the smaller codec, but this clip is
 * half granule texture — the densest thing you can hand an encoder — and at
 * matched quality the WebM came out LARGER (4.9MB vs 3.9MB at 1080). So every
 * mainstream browser takes the MP4; the WebM stays only for the rare build
 * without H.264 (some Linux Firefox), where a fallback beats a blank hero.
 */
const SOURCES = [
  { src: "/videos/hero-background.mp4", type: "video/mp4" },
  { src: "/videos/hero-background.webm", type: "video/webm" },
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
        if (!el) return;
        // React sets `muted` as a DOM PROPERTY and never emits the HTML
        // attribute. Chromium checks the property and plays anyway; iOS Safari
        // checks the ATTRIBUTE, refuses autoplay without it, and we fall back
        // to the photo — which is what the owner saw on his iPhone
        // (2026-08-01). Set both, and set them before the element loads.
        el.setAttribute("muted", "");
        el.muted = true;
      }}
      // Wait for a source to be READY before playing. Calling play() straight
      // from the ref raced source selection: if the first source could not be
      // decoded, the rejection unmounted us before the browser ever tried the
      // second one.
      onCanPlay={() => {
        ref.current
          ?.play()
          .then(() => setVisible(true))
          // Refused (iOS Low Power Mode, browser policy) — stay on the photo.
          .catch(() => setShow(false));
      }}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      // A failing <source> surfaces here too, and treating that as fatal
      // unmounted us the moment the first source could not be decoded — before
      // the browser had tried the second. Only the VIDEO itself failing (every
      // source exhausted) means there is nothing left to play.
      onError={(e) => {
        if (e.target !== e.currentTarget) return;
        setShow(false);
      }}
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
