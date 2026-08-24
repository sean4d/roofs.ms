import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Wordmark plus the parent-company line.
 *
 * The second line is doing real work: it is how a visitor learns these are
 * the same people as the roofing company. Wording matters — Southeast Lights
 * is a d/b/a of Southeast Roofing LLC, one legal entity, so "a division of"
 * is accurate where "a subsidiary of" (what the old Wix site said) is not.
 *
 * [NEEDS: official logo artwork, including a white knockout for night
 * surfaces.] Until it arrives this renders as type, which is honest and
 * looks deliberate rather than broken.
 */
export function BrandLockup({
  className,
  onNight = true,
}: {
  className?: string;
  onNight?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight sm:text-xl",
          onNight ? "text-white" : "text-navy-900",
        )}
      >
        Southeast<span className="text-glow-500">&nbsp;Lights</span>
      </span>
      <span
        className={cn(
          "mt-1 text-[0.68rem] tracking-wide",
          onNight ? "text-steel-300" : "text-slate-600",
        )}
      >
        A division of {siteConfig.parent.name}
      </span>
    </Link>
  );
}
