import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: roof mark, then the name set in type beside it.
 *
 * The same arrangement the roofing site uses, and for the same reason: the
 * mark alone is not a wordmark. Someone landing from a search result has to
 * read who this is, and a red roof with a Santa hat does not say "Southeast
 * Lights" to a first-time visitor.
 *
 * WHAT IS DELIBERATELY NOT HERE is lettering baked into the image. The
 * supplied artwork sets "SOUTHEAST LIGHTS" under a divider bar, and pairing
 * that with this typeset name printed it twice in two different faces inside
 * forty pixels. The image is cropped to the mark; the name is HTML. That
 * split is also what makes the name legible at any size, keeps it selectable
 * and translatable, and lets the icons reuse the same crop, since a wordmark
 * at sixteen pixels is a smear while a red roof is still a red roof.
 */
const SIZES = {
  /* Header: compact, and stacks the name on the narrowest phones so the
     lockup never crowds the menu button. */
  header: {
    gap: "gap-2.5",
    mark: "h-9 sm:h-11",
    text: "text-lg sm:text-xl",
    stack: true,
  },
  /* Footer: larger, and never stacked. There is nothing beside it to crowd. */
  footer: {
    gap: "gap-3",
    mark: "h-12 sm:h-14",
    text: "text-xl sm:text-2xl",
    stack: false,
  },
} as const;

export function Logo({
  className,
  size = "header",
}: {
  className?: string;
  /** "footer" is the same lockup, larger and on one line. */
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center", s.gap, className)}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        /* Descriptive alt for crawlers and image search. The anchor's
           aria-label supplies the accessible name, so a screen reader
           announces the link once rather than twice. */
        src="/brand/southeast-lights-roofmark.png"
        alt="Southeast Lights logo"
        width={1523}
        height={800}
        /* Only the header lockup is above the fold. Preloading the footer's
           copy would compete with the hero for the same connection. */
        priority={size === "header"}
        className={cn(
          "w-auto shrink-0 object-contain transition-opacity duration-200 group-hover:opacity-90",
          s.mark,
        )}
      />
      <span
        className={cn(
          "font-display leading-none font-semibold tracking-tight text-bone-100",
          s.text,
        )}
      >
        Southeast
        {s.stack ? <br className="sm:hidden" /> : " "}
        <span className={s.stack ? "sm:before:content-['_']" : undefined}>
          Lights
        </span>
      </span>
    </Link>
  );
}
