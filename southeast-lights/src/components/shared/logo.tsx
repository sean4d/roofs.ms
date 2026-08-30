import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The Southeast Lights mark: the roof and the Santa hat, and nothing else.
 *
 * NO LETTERING, anywhere it appears. The supplied logo file sets the words
 * "SOUTHEAST LIGHTS" under a divider bar, and the header used to render that
 * artwork beside a second, typeset "Southeast Lights" alongside it. The name
 * therefore appeared twice, in two different typefaces, in a space about
 * forty pixels tall. Cropping to the mark is what the roofing site does and
 * it is the reason its header reads cleanly at every width.
 *
 * The mark alone is also the only version that survives being an icon. A
 * favicon is sixteen pixels; a wordmark at sixteen pixels is a grey smear,
 * while a red roof is still a red roof. src/app/icon.png and apple-icon.png
 * are generated from the same crop, so the tab, the home screen and the
 * header are one identity rather than three.
 *
 * The company name is not lost: it is the accessible name of this link, it
 * is the <title> of every page, and the footer carries the full legal line.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src="/brand/southeast-lights-roofmark.png"
        alt=""
        width={1523}
        height={800}
        priority
        className="h-9 w-auto shrink-0 object-contain transition-opacity duration-200 group-hover:opacity-90 sm:h-11"
      />
    </Link>
  );
}
