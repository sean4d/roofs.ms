"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * A photograph that drifts against the scroll inside its own frame, so the
 * picture and the text beside it move at slightly different speeds.
 *
 * THE DRIFT IS INSIDE THE FRAME, NOT THE FRAME ITSELF. The outer element
 * holds its place in the layout and clips; only the image inside it moves.
 * Moving the frame is what produces the gaps and overlaps that make cheap
 * parallax look broken at the top and bottom of its travel.
 *
 * THE IMAGE IS OVER-TALL ON PURPOSE. It renders at 112% of the frame's
 * height and starts offset upward, so there is real picture to slide into
 * view at both ends of the travel and no edge of the photograph is ever
 * exposed. Pass the travel distance down if the frame is short: a 24px
 * drift in a 200px frame is visible, in a 700px frame it is not.
 *
 * Worth using once per page, on the one image that has room to move. Three
 * parallaxing photos on one screen compete with each other and with the
 * reader's sense of where the page actually is.
 */
export function ParallaxMedia({
  children,
  className,
  /** Total vertical travel in pixels across the whole scroll window. */
  distance = 40,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="h-[112%] [&>*]:h-full">
        {children}
      </motion.div>
    </div>
  );
}
