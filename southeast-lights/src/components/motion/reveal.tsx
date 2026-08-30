"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fadeIn, fadeRise, fadeScale, viewportOnce } from "@/lib/motion";

/**
 * Viewport-triggered entrance: fade and rise, once.
 *
 * This is a client component that takes server-rendered children as a prop,
 * so wrapping a server section in it costs nothing: the content is still
 * rendered on the server and only the wrapper ships JavaScript.
 */
const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  figure: motion.figure,
  span: motion.span,
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds. For choreography inside one block, not for whole sections. */
  delay?: number;
  as?: keyof typeof tags;
  /** "scale" for large photographs, where a rise reads as a jolt. */
  variant?: "rise" | "fade" | "scale";
}) {
  const reduced = useReducedMotion();
  const Tag = tags[as];
  const variants = reduced
    ? fadeIn
    : variant === "scale"
      ? fadeScale
      : variant === "fade"
        ? fadeIn
        : fadeRise;

  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}
