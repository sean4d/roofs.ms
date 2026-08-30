import type { Variants } from "framer-motion";

/**
 * One motion vocabulary for the whole site, ported from the roofing site so
 * the two properties move the same way. Same ease, same distance, same
 * stagger, same animate-once viewport. A visitor who sees both should read
 * them as one company, and motion is a surprisingly strong part of that.
 *
 * The rules, in short:
 *   - Everything enters the same way: fade plus a short rise.
 *   - Nothing animates twice. A section that re-plays every time it scrolls
 *     back into view stops feeling like craft and starts feeling like a page
 *     that will not settle.
 *   - Siblings stagger by 80ms. Enough to read as a sequence, short enough
 *     that a six-card grid is fully in within half a second.
 *   - prefers-reduced-motion drops the movement and keeps the fade. It never
 *     removes the transition entirely, because an element that pops in with
 *     no transition at all reads as a layout bug.
 */

/** The signature ease: fast out of the gate, long settle. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;

/** The standard entrance. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Reduced-motion fallback, and the right choice for large images. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/**
 * A photograph settling rather than sliding. Used where the moving thing is
 * a big image: a 28px rise on a full-bleed photo reads as a jolt, while an
 * almost imperceptible scale-down reads as the picture coming to rest.
 */
export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

/** Parent that staggers its children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/**
 * Animate once, and start slightly before the element is fully on screen.
 * The negative margin is what stops a card animating only after the reader
 * has already looked straight at it, which is the most common way scroll
 * reveals end up feeling late rather than deliberate.
 */
export const viewportOnce = { once: true, margin: "-80px" } as const;
