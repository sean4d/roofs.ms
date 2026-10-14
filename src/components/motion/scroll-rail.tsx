"use client";

import { createContext, useContext, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * A process timeline whose connecting rule fills as the reader scrolls,
 * lighting each step as the fill reaches it.
 *
 * WHY THIS ONE IS SCRUBBED AND THE REST OF THE SITE IS NOT. Every other
 * animation here fires once when its element arrives and then is done,
 * which is right for a reveal: it is an entrance. A process is different.
 * The thing being communicated is "these happen in this order", and tying
 * the fill to scroll position makes the reader's own movement the thing
 * advancing it. That is the only place on the page where scrubbing earns
 * the extra frames it costs.
 *
 * The progress value is shared through context rather than recomputed per
 * step, so five steps mean one scroll listener, not five.
 *
 * Under prefers-reduced-motion the rail is simply drawn full and every step
 * is lit. The order is still legible, because it was always carried by the
 * numbers and the layout rather than by the animation.
 */

const RailContext = createContext<{
  progress: MotionValue<number> | null;
  count: number;
} | null>(null);

export function ScrollRail({
  children,
  count,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  count: number;
  className?: string;
  as?: "div" | "ul";
}) {
  // One ref serves both tags, so it is typed to the element they share.
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  /*
   * The window starts when the block's top reaches 75% down the viewport
   * and ends when its bottom passes 65%, so the fill completes while the
   * last step is still comfortably on screen rather than at the instant it
   * leaves. Ending at "end end" is the common mistake: the rail finishes
   * filling after the reader has already scrolled past the thing it fills.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });

  const Element = Tag === "ul" ? motion.ul : motion.div;

  return (
    <RailContext.Provider
      value={{ progress: reduced ? null : scrollYProgress, count }}
    >
      <Element
        ref={ref as React.Ref<HTMLDivElement & HTMLUListElement>}
        className={className}
      >
        {children}
      </Element>
    </RailContext.Provider>
  );
}

/**
 * The filling rule itself. Positioned by the caller (absolute, inset to
 * wherever the rule belongs); this only supplies the growth.
 */
export function RailLine({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  const ctx = useContext(RailContext);
  const axis = orientation === "horizontal" ? "scaleX" : "scaleY";
  const origin = orientation === "horizontal" ? "left" : "top";

  if (!ctx?.progress) {
    return <div aria-hidden="true" className={className} />;
  }

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={{ [axis]: ctx.progress, transformOrigin: origin }}
    />
  );
}

/**
 * A step marker that lights as the fill reaches it.
 *
 * THE STEP'S CONTENT IS NEVER HIDDEN. What fades in is a ring drawn on top
 * of the marker, so the icon, the number and the text are all fully present
 * from first paint and the lighting is decoration over them. Fading the
 * content itself would mean a reader who lands mid-page, a crawler, or
 * anyone whose scroll never reaches the threshold sees a blank process.
 *
 * The light comes up over the span of one step rather than snapping, so
 * steps close together cross-fade instead of blinking.
 */
export function RailStep({
  index,
  children,
  className,
  /** Classes for the ring that fades in over the marker. */
  ringClassName = "rounded-full ring-2 ring-primary",
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
  ringClassName?: string;
}) {
  const ctx = useContext(RailContext);
  const span = 1 / Math.max(ctx?.count ?? 1, 1);
  const at = index * span;
  const progress = ctx?.progress;

  // Hooks cannot be conditional, so the transform is always built; on the
  // reduced-motion path the fallback simply pins it lit.
  const fallback = useTransform(() => 1);
  const lit = useTransform(progress ?? fallback, [at, at + span], [0, 1], {
    clamp: true,
  });

  return (
    <span className={`relative inline-flex ${className ?? ""}`}>
      {children}
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${ringClassName}`}
        style={{ opacity: progress ? lit : 1 }}
      />
    </span>
  );
}
