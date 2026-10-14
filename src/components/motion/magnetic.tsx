"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * A control that leans toward the cursor as it approaches, and springs back
 * when the cursor leaves.
 *
 * POINTER-TYPE GATED, NOT WIDTH-GATED. The effect is meaningless without a
 * cursor and actively harmful with a finger: a touch target that moves
 * between the tap starting and landing is a missed tap. The guard is
 * `(pointer: fine)`, which asks the real question, where a breakpoint only
 * asks how wide the screen is. A touchscreen laptop at 1440px passes a
 * width check and fails this one, correctly.
 *
 * THE PULL IS DELIBERATELY SMALL. The default travel is 6px, about a
 * quarter of what a showreel version uses. On a roofing company's "Free
 * Inspection" button, a control that visibly chases the cursor reads as a
 * trick; a control that leans slightly reads as responsive. The element
 * never leaves its own hit area, so the thing under the cursor when it is
 * clicked is still the thing the cursor was aimed at.
 */
export function Magnetic({
  children,
  className,
  /** Maximum travel in pixels, at the edge of the element. */
  strength = 6,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Low stiffness and high damping: it settles rather than wobbles. A
  // bouncy spring here is what makes the effect read as a toy.
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  if (reduced) {
    /*
     * inline-block here too, not a bare span. Callers size this wrapper
     * (the hero buttons are w-full on a phone and w-auto above it), and
     * width does nothing on an inline box, so dropping the display on the
     * reduced-motion path would quietly shrink those buttons for exactly
     * the people least likely to report it.
     */
    return (
      <span className={`inline-block ${className ?? ""}`}>{children}</span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block [@media(pointer:coarse)]:!transform-none ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        // Offset from the element's centre, normalised to -1..1, so the
        // pull is proportional to how far off-centre the cursor is.
        const dx =
          (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
        const dy =
          (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
        x.set(Math.max(-1, Math.min(1, dx)) * strength);
        y.set(Math.max(-1, Math.min(1, dy)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
