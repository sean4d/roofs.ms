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
 * A COMPACT TAB ON THE RIGHT EDGE. 44 by 230, and every number in that pair
 * was argued down from something worse.
 *
 * Width went 50, then 48, then 46, then 44. Width is what decides whether the
 * tab is unobtrusive, because it is the part that sits over the page: 44px of
 * a 390px screen is a ninth of it.
 *
 * Height went 115 (too cramped to read at arm's length), 175, 190, then
 * clamp(300px, 44vh, 380px), which on an iPhone 13 came out 371px around
 * 141px of icon and label. That is 115px of empty navy above the content and
 * the same below, and the owner called it a banner. It was one. Height no
 * longer answers to the viewport at all: 230 is the label plus a deliberate
 * margin, which is what a shortcut to a tool should be.
 *
 * SHAPE, SEPARATELY. One of those rounds used an asymmetric border-radius and
 * it was still wrong, for a reason worth stating: the reference tabs are not
 * rounded rectangles. Their left edge curves INWARD at the top and the bottom,
 * so the tab is pinched at its ends and full width through the middle.
 * border-radius cannot express that. It only ever rounds a corner off, convex,
 * away from the shape. A concave scoop is material removed from where a square
 * corner would be, and no combination of radii produces one. So the silhouette
 * is an SVG path; see the comment on it below.
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
 *   The bottom bar   it is centred rather than pinned above the bar, which at
 *                    230px tall leaves well over 100px of clearance to it even
 *                    on a 640px Android.
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
      /*
       * Nothing to duplicate on this page, so show it.
       *
       * DEFERRED, AND NOT ONLY TO SATISFY react-hooks/set-state-in-effect.
       * An IntersectionObserver delivers its first callback asynchronously
       * even when a target is already on screen, so the observed path below
       * always resolves one tick after mount. Setting state synchronously here
       * would make this path resolve during the mount commit instead: the same
       * component would reach its visible state through two different render
       * sequences depending on the page, which is the kind of difference that
       * shows up later as a flicker on one page and not the other.
       */
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) setShown(true);
      });
      return () => {
        cancelled = true;
      };
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
        /*
          CENTRED ON THE EDGE, not anchored above the bottom bar.

          It used to sit just over the Call Now / Free Inspection bar. Centred
          it is further from every other piece of furniture on the screen: at
          230px tall on the shortest handset worth testing, a 640px Android, it
          spans roughly 205 to 435, which clears the header above and leaves
          about 140px to the bottom bar below.
        */
        "fixed top-1/2 right-0 z-40 -translate-y-1/2 md:hidden",
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
        "flex items-center justify-center gap-2",
        "text-[12px] font-semibold tracking-[0.02em] text-primary-foreground",
        "transition-[opacity,transform] duration-300 ease-out",
        // translate-x only: the -translate-y-1/2 above is what centres it, and
        // a second translate utility on the same axis would cancel it.
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
        /*
          HEIGHT IS SET, AND SET TO FIT THE LABEL.
          
          The long version ran clamp(300px, 44vh, 380px), which on an iPhone 13
          meant 371px holding about 141px of icon and text: 115px of empty
          navy above it and the same below. The owner called it a banner and
          he was right. It is a shortcut to a tool, not a feature panel.
          
          230 is the label plus a deliberate margin, and the margin is what
          stops it looking cramped rather than what pads it out to a length.
          The content lands inside the straight middle section with a few
          pixels to spare, which matters more here than it looks: the tapers
          narrow the tab toward the screen edge, so a label that ran into one
          would have its first or last letter outside the painted shape.
          
          No clamp any more. A compact tab has no reason to answer to the
          viewport, and 230 sits comfortably on the shortest handset worth
          testing without ever reaching for the header or the bottom bar.
          
          paddingBlock is the only padding left, and it is what sets the
          width: 13 each side plus the ~18px glyph box of 12px type is 44.
        */
        height: "230px",
        paddingBlock: "13px", // across the text: the ribbon's width
      }}
    >
      {/*
        THE SILHOUETTE: A TONGUE THAT GROWS OUT OF THE SCREEN EDGE.

        The previous attempt was a rectangle with two circular bites taken out
        of its left edge, and the owner was right to reject it. Two things made
        it that:

          A FLAT TOP EDGE. It began with L16 0, a 28px horizontal run, so the
          tab arrived at its top as a blunt rectangle and only then got carved.
          The reference tabs have no top edge at all. They taper into the
          screen edge and vanish.

          QUADRATICS WITH THE CONTROL POINT ON THE CORNER. Q16 42 0 42 puts the
          control exactly where the square corner would be, which is the
          textbook way to draw a quarter circle. A quarter circle removed from
          a straight edge IS a bite. There was no way to soften it by moving
          the numbers; the curve type was wrong.

        What it is now, read clockwise from the top:

          M44 0            the top point, flush on the screen edge, zero width
          C44 18 0 18      leaves heading straight DOWN, sweeps left, arrives
            0 36           heading straight DOWN again: one smooth S
          V194             the straight run that carries the label
          C0 212 44 212    the same S mirrored, back into the edge
            44 230
          Z                straight up the right edge and closed

        The S comes from the tangents, not the sweep. Both control points of
        the first curve sit directly BELOW their own endpoint, halfway down the
        taper, so the curve leaves the edge vertically and meets the straight
        section vertically. There is no corner anywhere for a bite to be taken
        out of, and the transition is gradual rather than a quarter turn.

        THE NUMBERS CHANGED, THE CONSTRUCTION DID NOT. 50x175, then 44x350,
        now 44x230: the same two curves restretched on each new grid, with the
        taper held at a sixth of the height throughout (36 of 230 here) so the
        curves keep the same character whatever the tab's length. Control
        points stay directly below their endpoints at the taper's midpoint,
        which is the only thing that makes the S an S.

        Widest through the middle, tapering into the edge at both ends, which
        is what the reference tabs do.

        The drop-shadow filter is on the path rather than the anchor so it
        traces the taper instead of outlining the rectangle behind it.
      */}
      <svg
        viewBox="0 0 44 230"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ filter: "drop-shadow(-2px 0 6px rgb(18 59 99 / 0.22))" }}
      >
        <path
          d="M44 0 C44 18 0 18 0 36 V194 C0 212 44 212 44 230 Z"
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
      <Ruler className="relative size-3 -rotate-90" aria-hidden="true" />
      <span className="relative">Instant Estimate</span>
      <span aria-hidden="true" className="relative size-3 shrink-0" />
    </Link>
  );
}
