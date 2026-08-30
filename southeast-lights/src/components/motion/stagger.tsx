"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fadeIn, fadeRise, staggerContainer, viewportOnce } from "@/lib/motion";

/**
 * A group whose children arrive one after another.
 *
 * The container owns the trigger and the timing; each item only declares how
 * it moves. That split is why a grid can restack at any breakpoint without
 * the choreography needing to know: the stagger follows DOM order, which is
 * the order a reader scans in anyway.
 *
 *   <StaggerGroup className="grid gap-4 sm:grid-cols-3">
 *     <StaggerItem>…</StaggerItem>
 *     <StaggerItem>…</StaggerItem>
 *   </StaggerGroup>
 */
export function StaggerGroup({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "dl";
}) {
  const Tag = as === "ul" ? motion.ul : as === "dl" ? motion.dl : motion.div;
  return (
    <Tag
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Tag =
    as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <Tag
      data-reveal=""
      className={className}
      variants={reduced ? fadeIn : fadeRise}
    >
      {children}
    </Tag>
  );
}
