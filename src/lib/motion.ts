import type { Variants } from "framer-motion";

/**
 * Shared motion vocabulary (PRD §7.1) so every animated component moves the
 * same way: fade + 24–32px rise, custom ease, 60–90ms sibling stagger,
 * animate-once viewports. Components must respect prefers-reduced-motion
 * (framer-motion's reducedMotion config is set in the providers).
 */

/** Signature ease, "expensive and controlled" (PRD §7.1). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;

/** Standard section/element reveal: fade + rise. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Simple fade (reduced-motion-friendly fallback and subtle elements). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Parent container that staggers its children's reveals. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** whileInView viewport config, animate once, slightly before fully visible. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
