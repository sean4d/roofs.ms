"use client";

import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT, viewportOnce } from "@/lib/motion";

/**
 * Hand-drawn marker stroke that draws itself behind a phrase.
 *
 * For the one claim in a section that should land harder than the rest: a
 * free inspection, a warranty length, a licence. One per section at most.
 * Two of these on a screen stop meaning "look here" and start meaning
 * "this site has a highlighter".
 *
 * HOW IT DRAWS. The stroke is a single SVG path with a deliberately uneven
 * top edge, stretched to the width of the phrase with preserveAspectRatio
 * "none", and revealed by animating pathLength from 0 to 1. Animating the
 * path rather than a box is what makes it read as drawn by a hand instead
 * of wiped by a machine, and it is why the ends are rounded.
 *
 * WHY IT SITS BEHIND THE TEXT. The stroke is absolutely positioned with a
 * negative z-index inside a relatively positioned inline span, so the words
 * stay fully opaque on top of it and contrast is unchanged. A marker drawn
 * over text would fail contrast the moment the stroke covered a glyph.
 */
export function MarkerHighlight({
  children,
  className,
  /** Seconds before the stroke starts, so it can land after the heading. */
  delay = 0.25,
  /*
   * Stroke colour. The default is steel-300, the lightest brand blue that
   * is still visibly a mark on the site's two page surfaces: the accent
   * token (#e8eff6) is a tint for icon chips and disappears entirely on
   * the #f5f7fa surface sections, which is how the first version of this
   * shipped invisible. Ember (#c9702e) is the warmer alternative and reads
   * much louder, which is sometimes the point.
   */
  color = "var(--color-steel-300, #8faecb)",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  color?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <svg
        aria-hidden="true"
        /*
         * z-0 and a z-10 text layer, NOT a negative z-index on the stroke.
         * A negative z-index on a child with no stacking context of its own
         * sends the element behind the nearest ancestor that paints a
         * background, which here is the section. The first version of this
         * did exactly that and drew the marker invisibly under the page.
         */
        className="absolute inset-x-[-0.18em] bottom-[-0.1em] z-0 h-[0.82em] w-[calc(100%+0.36em)]"
        viewBox="0 0 300 30"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          /*
           * Two overlapping sweeps, the way a real marker doubles back: the
           * top edge is not level and the second pass sits slightly proud of
           * the first. A straight rounded rectangle here looks like a CSS
           * background, which is the whole thing this is avoiding.
           */
          d="M6 20 C 60 11, 120 13, 180 12 C 228 11, 266 14, 294 11 C 268 20, 210 22, 150 23 C 96 24, 44 23, 8 25"
          stroke={color}
          strokeWidth={17}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.85, delay, ease: EASE_OUT }
          }
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  );
}
