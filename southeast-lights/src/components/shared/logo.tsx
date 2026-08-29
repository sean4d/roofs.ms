import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The official Southeast Lights mark, plus the division line.
 *
 * The second line is doing real work: it is how a visitor learns these are
 * the same people as the roofing company. Wording matters. Southeast Lights
 * is a d/b/a of Southeast Roofing LLC, one legal entity, so "the lighting
 * division of" is accurate where "a subsidiary of" (the old Wix wording) is
 * not.
 */
export function Logo({
  className,
  showDivisionLine = true,
}: {
  className?: string;
  showDivisionLine?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src="/brand/southeast-lights-mark.png"
        alt=""
        width={1751}
        height={1034}
        priority
        className="h-9 w-auto shrink-0 object-contain sm:h-10"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-semibold tracking-tight whitespace-nowrap text-bone-100 sm:text-lg">
          Southeast Lights
        </span>
        {showDivisionLine ? (
          <span className="mt-1 hidden text-[0.66rem] leading-tight whitespace-nowrap text-bone-500 sm:block xl:hidden">
            The lighting division of {siteConfig.parent.name}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
