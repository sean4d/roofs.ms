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
 *
 * TWO MODES, AND GRIDS MUST USE THE SECOND ONE.
 *
 * On its own (the default) the component watches the viewport itself, which
 * is right for the one photograph in a section. In a grid it must be a
 * `inStagger` child of a StaggerGroup instead, and the group does the
 * watching for all of them.
 *
 * That is not a preference. Four of these mounted together, each with its
 * own viewport trigger, and the FIRST one silently never fires: it stays
 * clipped to nothing and the grid renders with an empty cell. It reproduced
 * every time, on the service galleries and the city pages, under a jump
 * scroll, a slow scroll and a reload part-way down. One trigger on the
 * parent avoids it completely, is cheaper than one observer per tile, and
 * hands the sequencing to staggerChildren, so `delay` is not needed either.
 */
export function ImageWipe({
  children,
  className,
  /** Edge the wipe travels from. */
  from = "bottom",
  delay = 0,
  /*
   * Take the cue from a parent StaggerGroup rather than from the viewport.
   * Required for anything rendered more than once in the same container.
   */
  inStagger = false,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
  delay?: number;
  inStagger?: boolean;
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

  const wipe = {
    hidden: { clipPath: hidden },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 1.1, ease: EASE_OUT },
    },
  };
  /*
   * Slower than the wipe and started at the same moment, so the settle
   * outlives the reveal instead of finishing inside it. Equal durations
   * make the pair read as one stiff move.
   */
  const settle = {
    hidden: { scale: 1.06 },
    visible: { scale: 1, transition: { duration: 1.6, ease: EASE_OUT } },
  };

  // In a group the parent supplies initial/whileInView and the stagger; on
  // its own the component supplies them itself.
  const trigger = inStagger
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: viewportOnce,
        transition: { delay },
      };

  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      variants={wipe}
      {...trigger}
    >
      <motion.div
        /*
         * h-full so the scale wrapper inherits a fixed-height frame instead
         * of collapsing to the picture's intrinsic height. Without it, a
         * caller that sets aspect-[4/3] on the outer box gets the image at
         * its own height and a strip of background left over below it,
         * which is exactly how this first went in. Against an auto-height
         * parent a percentage height resolves to auto, so the callers that
         * let the child set the height are unaffected.
         */
        className="h-full"
        variants={settle}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
