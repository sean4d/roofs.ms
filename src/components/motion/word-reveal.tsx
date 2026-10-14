"use client";

import { motion, useReducedMotion } from "framer-motion";

import { DURATION, EASE_OUT, viewportOnce } from "@/lib/motion";

/**
 * Masked word reveal: each word rises out of its own clipped line, one
 * after another, the way a headline lands in a title sequence.
 *
 * WHY THE WORDS ARE SPLIT IN THE MARKUP AND NOT BY SCRIPT ON LOAD. The
 * usual implementation of this effect measures the rendered text, slices it
 * into spans and animates them. That costs a layout pass before anything
 * can move, and it leaves the heading briefly invisible, which is exactly
 * the thing an LCP measurement punishes. Splitting on whitespace at render
 * time has neither problem: the server emits the finished spans.
 *
 * THE WHOLE STRING STAYS IN THE ACCESSIBILITY TREE. The visible spans are
 * hidden from assistive tech and one screen-reader-only copy carries the
 * real text, so a screen reader reads a sentence rather than a column of
 * single words, and a crawler extracting the heading gets the sentence too.
 *
 * Reduced motion gets the text with no movement at all: not a faster
 * version of the same slide, which is still the thing that was objected to.
 */
export function WordReveal({
  text,
  className,
  /** Seconds between each word. Lower reads as one motion, higher as typing. */
  stagger = 0.055,
  /** Seconds before the first word moves, to follow something else. */
  delay = 0,
  as: Tag = "span",
  /*
   * Index of the first word that takes the accent colour, so a headline
   * keeps its two-tone treatment. The hero's "Roofing done right." is one
   * string with the last word in steel, and splitting it into two separate
   * WordReveals would restart the stagger halfway through the line.
   */
  accentFrom,
  /*
   * Exclusive end of the accent run. The hero headline is lead + accent +
   * tail, and the tail is empty today; without this bound, the day someone
   * fills the tail in it would silently take the accent colour too.
   */
  accentTo,
  accentClassName = "text-steel-300",
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
  accentFrom?: number;
  accentTo?: number;
  accentClassName?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  const accentAt = (i: number) =>
    accentFrom !== undefined &&
    i >= accentFrom &&
    i < (accentTo ?? words.length)
      ? accentClassName
      : undefined;

  if (reduced) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className={accentAt(i)}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
      >
        {words.map((word, i) => (
          /*
           * The clipping box is inline-block with hidden overflow, and the
           * descender room matters: without the small negative margin the
           * box crops the tail of a "g" or "y" as the word settles. The
           * trailing space is a real space character outside the mask, so
           * the line still wraps and copies as a sentence.
           */
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className={`inline-block ${accentAt(i) ?? ""}`}
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: 0,
                  transition: { duration: DURATION.slow, ease: EASE_OUT },
                },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
