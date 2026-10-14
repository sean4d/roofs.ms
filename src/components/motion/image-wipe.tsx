"use client";

import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT, viewportOnce } from "@/lib/motion";

/**
 * Directional wipe reveal for a photograph, with the image drifting back
 * from a slight over-scale as the wipe passes.
 *
 * The two halves are the point. A wipe on its own is a transition; a wipe
 * with the picture still settling behind it reads as a camera finding its
 * frame. The scale starts at 1.06 and ends at 1, so the finished state is
 * the real pixels, not a permanently enlarged, softer copy of them.
 *
 * WHY clip-path AND NOT A SLIDING OVERLAY. An overlay panel has to be
 * coloured, which means guessing the background behind the image, and it
 * paints a full-width rectangle every frame. clip-path on the container
 * composites on the GPU and works over any background, including the
 * photographs this site puts images on top of.
 *
 * The container reserves the image's space from first paint, so nothing
 * reflows when the wipe runs and the reveal cannot shift layout.
 */
export function ImageWipe({
  children,
  className,
  /** Edge the wipe travels from. */
  from = "bottom",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
  delay?: number;
}) {
  const reduced = useReducedMotion();

  const hidden = {
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={viewportOnce}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    >
      <motion.div
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={viewportOnce}
        /*
         * Slower than the wipe and started at the same moment, so the
         * settle outlives the reveal instead of finishing inside it. Equal
         * durations make the pair read as one stiff move.
         */
        transition={{ duration: 1.6, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
