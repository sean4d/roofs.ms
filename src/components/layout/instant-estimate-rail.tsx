"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ruler } from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * The right-edge tab to the instant estimator, phones and small tablets only.
 *
 * WHY A RAIL AND NOT ANOTHER BAR. The bottom of a phone screen is already
 * spoken for: StickyMobileCTA owns the full width with Call Now and Free
 * Inspection, and that bar converts. A third button down there would either
 * shrink those two or stack on top of them. The right edge is the one piece of
 * persistent furniture the layout has left, and a vertical tab is how it gets
 * used without stealing reading width: the rail is 40px of a 390px screen and
 * sits over the page gutter rather than over text.
 *
 * WHAT IT HAS TO STAY CLEAR OF, and how:
 *
 *   The bottom bar   bottom is pinned above it: 4rem of bar plus the safe-area
 *                    inset plus a gap, so the two never touch on any handset.
 *   The header       z-40, one below the header and the bottom bar at z-50, so
 *                    an open nav dropdown covers the rail rather than fighting
 *                    it.
 *   A notch or a     the right inset is added to its own offset, so on a
 *   curved edge      landscape iPhone it clears the sensor housing instead of
 *                    hiding under it.
 *   Chat widgets     third-party bubbles conventionally sit bottom-right at
 *                    the corner. This sits mid-height on the edge, well above
 *                    the corner a widget would occupy.
 *
 * DESKTOP DOES NOT GET THIS. Above md the same journey is a real button in the
 * header next to Free Inspection, where people look for it. Showing both would
 * be two invitations to the same place, and the floating one is the weaker of
 * the two on a pointer device.
 */
export function InstantEstimateRail() {
  const pathname = usePathname();

  // Never on the tool itself, and never over the internal apps. Offering a
  // shortcut to the page somebody is already reading is noise, and /pin and
  // /studio are not marketing surfaces at all.
  if (
    pathname === siteConfig.links.instantEstimate ||
    pathname.startsWith("/pin") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/production")
  ) {
    return null;
  }

  return (
    <Link
      href={siteConfig.links.instantEstimate}
      data-testid="instant-estimate-rail"
      aria-label="Get a free instant roof estimate"
      className={[
        // Anchored to the right edge, sitting just above the bottom bar.
        "fixed right-0 z-40 md:hidden",
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))]",
        "mr-[env(safe-area-inset-right,0px)]",
        // The tab itself: written bottom-to-top, rounded on the left so it
        // reads as attached to the edge of the screen rather than floating.
        "flex items-center gap-2 rounded-l-xl bg-primary py-4 pr-1.5 pl-2.5",
        "text-[13px] font-bold tracking-wide text-primary-foreground",
        "shadow-[-4px_0_16px_rgb(18_59_99_/_0.28)]",
        "transition-colors active:bg-navy-700",
        // Focus has to be visible against the navy, so the ring is offset
        // outward rather than drawn inside the tab.
        "focus-visible:ring-3 focus-visible:ring-steel-500 focus-visible:outline-none",
      ].join(" ")}
      style={{
        writingMode: "vertical-rl",
        // vertical-rl alone reads top-to-bottom. Turned 180 degrees it reads
        // bottom-to-top, which is the convention for a tab on a right edge and
        // the only orientation that does not make the reader tilt the wrong way.
        transform: "rotate(180deg)",
      }}
    >
      <Ruler className="size-4 rotate-90" aria-hidden="true" />
      <span>Free Instant Estimate</span>
    </Link>
  );
}
