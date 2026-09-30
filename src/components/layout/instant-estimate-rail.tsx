"use client";

import { useEffect, useState } from "react";
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
 * persistent furniture the layout has left.
 *
 * IT STANDS DOWN WHILE A REAL BUTTON IS ON SCREEN. The first version was
 * always visible, so on the homepage it sat there duplicating the big white
 * "Free Instant Estimate" button in the hero, two feet apart, both going to
 * the same page (owner, 2026-09-30). A sticky shortcut is for when the thing
 * it shortcuts has scrolled away. So it watches every element marked
 * data-estimate-cta and hides while any of them is in view.
 *
 * On a page with no such CTA there is nothing to duplicate, so it shows from
 * the start.
 *
 * THIN AND LONG, WITH SCOOPED ENDS. 44 by 190, about one to four and a half.
 * It went 45x115 (too cramped to read), 48x190 (too heavy), 46x170, then a
 * version with an asymmetric border-radius, and now this.
 *
 * The radius version was still wrong, and the reason is worth stating: the
 * reference tabs are not rounded rectangles at all. Their left edge curves
 * INWARD at the top and the bottom, so the tab is pinched at its ends and
 * full width through the middle. border-radius cannot express that. It only
 * ever rounds a corner off, convex, away from the shape. A concave scoop is
 * material removed from where a square corner would be, and no combination of
 * radii produces one.
 *
 * So the silhouette is an SVG path. See the comment on it below. The first slim version was 45 by 115 and the owner called it "too
 * small and weird": at 11.5px the label was hard to read at arm's length, and
 * a short stubby block with a tight corner radius reads as a stray UI chip
 * rather than as part of the page. A tall tab with a generous left radius and
 * type you can actually read is the shape this pattern wants. Width is what
 * keeps it unobtrusive, and 48px of a 414px screen is under an eighth; height
 * is what makes it legible, and height costs nothing because it sits over the
 * page gutter rather than over text.
 *
 * WHY AN SVG AND NOT clip-path. clip-path: path() would draw the same
 * silhouette, but it takes absolute coordinates that do not follow the
 * element, and, more importantly, it clips hit-testing along with paint: the
 * scooped ends would stop accepting taps. Here the anchor stays an ordinary
 * rectangle that takes the tap, and the SVG underneath paints the shape. The
 * shape is decoration; the target is the box. preserveAspectRatio="none"
 * stretches the path to whatever the text makes the box, so nothing has to be
 * kept in sync by hand.
 *
 * WHAT IT STAYS CLEAR OF, and how:
 *
 *   The bottom bar   bottom is pinned above it: 4rem of bar plus the safe-area
 *                    inset plus a gap, so the two never touch on any handset.
 *   The header       z-40, one below the header and the bottom bar at z-50, so
 *                    an open nav dropdown covers the rail rather than fighting
 *                    it.
 *   A notch or a     the right inset is added to its own offset, so on a
 *   curved edge      landscape iPhone it clears the sensor housing.
 *   Chat widgets     third-party bubbles conventionally sit in the bottom
 *                    right corner. This sits mid-height on the edge.
 *
 * DESKTOP DOES NOT GET THIS. Above md the same journey is a real button in the
 * header next to Free Inspection.
 */
export function InstantEstimateRail() {
  const pathname = usePathname();
  /*
   * Starts hidden, on purpose.
   *
   * The observer below decides within a frame of mount. Starting visible would
   * flash the rail over the hero on every homepage load and then snatch it
   * away, which is worse than the duplication it exists to fix. Starting
   * hidden means the only thing anybody ever sees is the fade in.
   */
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-estimate-cta]");
    if (targets.length === 0) {
      // Nothing to duplicate on this page.
      setShown(true);
      return;
    }

    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        setShown(onScreen.size === 0);
      },
      {
        /*
         * ASYMMETRIC ON PURPOSE, and the bottom number is the important one.
         *
         * Top, -80px: a CTA has to be properly past the top of the screen
         * before it stops counting, so the rail does not flick back the
         * instant one pixel of the hero button clears the header.
         *
         * Bottom, +240px: the viewport is treated as reaching 240px BELOW the
         * fold. On a short handset, an iPhone SE at 667px or a 640px Android,
         * the hero button starts just under the fold, so a strict test said
         * "no CTA on screen" and showed the rail at the very top of the
         * homepage. The reader then scrolled down, met the real button, and
         * watched the rail vanish and come back. Counting a CTA that is about
         * to arrive as already here removes that entirely.
         */
        rootMargin: "-80px 0px 240px 0px",
        threshold: 0,
      },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [pathname]);

  // Never on the tool itself, and never over the internal apps.
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
      // Out of the tab order and off the screen reader's list while hidden, so
      // a keyboard or VoiceOver user cannot land on something nobody can see.
      tabIndex={shown ? undefined : -1}
      aria-hidden={shown ? undefined : true}
      className={[
        "fixed right-0 z-40 md:hidden",
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))]",
        "mr-[env(safe-area-inset-right,0px)]",
        // Rounded on the left, flush square against the screen edge, so it
        // reads as attached rather than floating. No transform: a rotate would
        // take the rounding with it and put the corners against the edge.
        /*
          No background and no box-shadow on the anchor: both would paint the
          rectangle the SVG exists to hide. The shadow moves onto the path as a
          drop-shadow filter, which follows the silhouette.

          AND NO `relative` HERE, however much it looks like it belongs. It is
          a position utility, so it competes with the `fixed` three lines up,
          and Tailwind emits `relative` after `fixed`, so it wins: the tab
          dropped out of fixed positioning, rejoined the flow and stretched to
          the full 390px of the screen. `fixed` already establishes the
          containing block the absolute SVG needs, so nothing was gained for
          it either.
        */
        "flex items-center gap-2.5",
        "text-[13px] font-semibold tracking-[0.02em] text-primary-foreground",
        "transition-[opacity,transform] duration-300 ease-out",
        shown
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-full opacity-0",
        "focus-visible:ring-3 focus-visible:ring-steel-500 focus-visible:outline-none",
        // Somebody who asked not to be moved at gets the state change without
        // the slide.
        "motion-reduce:transition-none",
      ].join(" ")}
      /*
        PADDING IS SET HERE, IN LOGICAL PROPERTIES, AND THAT IS NOT FUSSINESS.
        
        Tailwind's py-* compiles to padding-block and px-* to padding-inline.
        Under writing-mode: vertical-rl the inline axis is VERTICAL, so those
        two swap on screen: py-8 adds width, px-8 adds height. The tab carried
        py-2.5 and then py-8 through several rounds of tuning and the height
        never moved, because both were quietly padding the sides while pr-3 and
        pl-4, which are physical, overrode them to zero. The computed style
        read "0px 12px 0px 16px" against a class list asking for 32px top and
        bottom.
        
        Written out as padding-inline and padding-block there is nothing to get
        backwards: inline runs with the text, which here is down the screen and
        therefore height; block runs across it, which is width.
      */
      style={{
        writingMode: "vertical-rl",
        paddingInline: "18px", // along the text: the tab's height (the counterweight adds 24)
        paddingBlock: "12px", // across it: the tab's width
      }}
    >
      {/*
        THE SILHOUETTE.

        Drawn on a 44 by 190 grid and stretched to the real box. Read it from
        the top right, clockwise:

          M44 0    start flush against the screen edge
          L16 0    a short top edge, so the tab does not come to a point
          Q16 42   control pulled DOWN AND RIGHT, into the shape
            0 42   ending at the full-width left edge 42 down
          V148     the straight run that carries the label
          Q16 148  control pulled UP AND RIGHT, into the shape again
            16 190 ending back on the short bottom edge
          H44 Z    across to the screen edge and close

        The two Q curves are the whole point. A control point placed INSIDE
        the shape pulls the curve away from the corner it would otherwise
        fill, which carves material out rather than rounding it off. Move
        either control point outside, to 0 0 or 0 190, and the same two
        commands produce ordinary convex corners: same path syntax, opposite
        silhouette. That is the thing border-radius cannot do.

        The drop-shadow filter is on the path rather than the anchor so it
        traces the scoops instead of outlining the rectangle behind them.
      */}
      <svg
        viewBox="0 0 44 190"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ filter: "drop-shadow(-2px 0 6px rgb(18 59 99 / 0.22))" }}
      >
        <path
          d="M44 0 L16 0 Q16 42 0 42 V148 Q16 148 16 190 H44 Z"
          className="fill-primary"
        />
      </svg>
      {/*
        THE ICON SITS ABOVE THE LABEL AND THE LABEL IS STILL CENTRED.

        Those two pull against each other. With the icon simply in flow, the
        icon-plus-label group centres and the LABEL therefore sits low: 54px of
        clearance above it against 30 below, and the 24px difference is exactly
        the icon plus its gap. On a shape that is pinched at both ends that is
        visible, and it put the end of the word inside the bottom scoop.

        An empty element of the icon's own size at the other end restores it.
        Its own gap balances the icon's gap, so the label lands dead centre
        while the icon still reads as sitting near the top. No absolute
        positioning, nothing to keep in sync, and it holds at whatever size the
        label ends up.
      */}
      <Ruler className="relative size-3.5 -rotate-90" aria-hidden="true" />
      <span className="relative">Instant Estimate</span>
      <span aria-hidden="true" className="relative size-3.5 shrink-0" />
    </Link>
  );
}
