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
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
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
        priority
        className="h-9 w-auto shrink-0 object-contain transition-opacity duration-200 group-hover:opacity-90 sm:h-11"
      />
      {/* Stacks on the narrowest phones so the lockup never crowds the menu
          button, and sits on one line from the small breakpoint up. */}
      <span className="font-display text-lg leading-none font-semibold tracking-tight text-bone-100 sm:text-xl">
        Southeast
        <br className="sm:hidden" />
        <span className="sm:before:content-['_']">Lights</span>
      </span>
    </Link>
  );
}
