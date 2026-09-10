"use client";

import { useSyncExternalStore } from "react";
import { Star } from "lucide-react";

import type { DisplayReview } from "@/lib/reviews";

/**
 * "Are we past hydration?", the sanctioned way.
 *
 * A useEffect that immediately setStates would do the same job and triggers
 * react-hooks/set-state-in-effect. useSyncExternalStore is the pattern React
 * documents for this: the server snapshot renders, then the client snapshot
 * takes over once hydration finishes. Nothing ever changes, so the subscribe
 * callback has nothing to do.
 */
const subscribeToNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Auto-scrolling wall of real Google reviews for the homepage. The track holds
 * two copies of the list and translates -50%, so the loop is seamless. Pauses
 * on hover/focus, and: for anyone who prefers reduced motion, becomes a
 * plain horizontal scroller instead of animating.
 *
 * THE SECOND COPY IS MOUNTED CLIENT-SIDE ONLY (SEO audit, 2026-09-10).
 *
 * The duplicate exists purely so the -50% translate wraps without a seam. It
 * is a visual trick, but it used to ship in the server-rendered HTML, which
 * meant every review's text appeared twice in the document a crawler reads.
 * Duplicate on-page text is the one thing this component should never create,
 * so the server now renders exactly one copy of each review and the browser
 * appends the mirror after hydration. The animation is held back until then,
 * otherwise a single-copy track would scroll halfway and leave a gap.
 */
export function ReviewMarquee({ reviews }: { reviews: DisplayReview[] }) {
  const mirrored = useSyncExternalStore(subscribeToNothing, onClient, onServer);

  if (reviews.length === 0) return null;
  // Slower for longer lists so speed feels constant regardless of count.
  const duration = Math.max(40, reviews.length * 6);
  const loop = mirrored ? [...reviews, ...reviews] : reviews;

  return (
    <div className="marquee group relative overflow-hidden">
      {/* Edge fades so cards enter/exit softly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-secondary to-transparent sm:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-secondary to-transparent sm:w-24"
      />

      <ul
        className="marquee-track flex w-max gap-5 py-2"
        style={
          mirrored
            ? { animation: `review-marquee ${duration}s linear infinite` }
            : undefined
        }
      >
        {loop.map((r, i) => (
          <li
            key={`${r.name}-${i}`}
            // The mirror exists for the seamless wrap only. Hide it from
            // assistive technology so nobody hears the same review twice.
            aria-hidden={i >= reviews.length || undefined}
            className="w-[19rem] shrink-0 rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <div
              className="flex gap-0.5"
              role="img"
              aria-label={`${r.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, s) => (
                <Star
                  key={s}
                  className={
                    s < r.rating
                      ? "size-4 fill-amber-400 text-amber-400"
                      : "size-4 fill-slate-200 text-slate-200"
                  }
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-slate-600">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-navy-900">{r.name}</p>
              <p className="text-xs text-slate-400">{r.when}</p>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes review-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee:hover .marquee-track,
        .marquee:focus-within .marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee { overflow-x: auto; }
          .marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
