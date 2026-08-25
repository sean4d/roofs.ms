import Image from "next/image";
import Link from "next/link";

import { Snowfall } from "@/components/effects/snowfall";
import { CallLink } from "@/components/shared/contact-actions";
import { QuoteButton } from "@/components/shared/quote-button";
import { IMAGES } from "@/config/images";
import { messagingFor, type SeasonMode } from "@/config/season";
import { COVERAGE } from "@/config/service-areas";

/**
 * The hero states the business differently by season, because the business
 * genuinely behaves differently. Holiday leads with the display and an honest
 * deadline; off-season leads with permanent lighting, which is what someone
 * is actually searching for in April.
 *
 * The image is a real element rather than a CSS background so next/image can
 * serve responsive formats and carry the LQIP blur. `priority` is set because
 * this is always the LCP element.
 */
export function Hero({ mode, now }: { mode: SeasonMode; now: Date }) {
  const holiday = mode === "holiday";
  const image = holiday ? IMAGES.holidayHero : IMAGES.permanentHero;
  const messaging = messagingFor(mode, now);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="object-cover"
        />
        <div className="scrim absolute inset-0" />
      </div>

      {holiday ? <Snowfall /> : null}

      <div className="container-site relative z-20 flex min-h-[86svh] flex-col justify-end pt-28 pb-16 lg:min-h-[90svh] lg:pb-24">
        <p className="eyebrow inline-flex w-fit items-center gap-2 rounded-full border border-champagne-400/30 bg-ink-950/50 px-4 py-2 text-champagne-300 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-champagne-400 motion-safe:animate-twinkle" />
          {messaging.badge}
        </p>

        <h1 className="mt-6 max-w-4xl text-[2.6rem] leading-[1.04] font-semibold text-balance sm:text-6xl lg:text-7xl">
          {holiday ? (
            <>
              Christmas lighting,{" "}
              <span className="text-champagne-gradient">done properly</span>.
            </>
          ) : (
            <>
              Exterior lighting that{" "}
              <span className="text-champagne-gradient">stays all year</span>.
            </>
          )}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone-300">
          {holiday
            ? "All-inclusive holiday lighting for premium homes, HOAs, communities and commercial properties. We design it, install it, maintain it, take it down and store it. You never touch a ladder."
            : "Permanent architectural, landscape and exterior lighting installed by a licensed roofing contractor. Warm white every evening, full colour for every holiday, and nothing to put up or take down."}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <QuoteButton location="hero" className="px-7 py-4 text-base" />
          <Link
            href={
              holiday
                ? "/holiday-lighting"
                : "/services/permanent-architectural-lighting"
            }
            className="btn-secondary px-7 py-4 text-base"
          >
            {holiday ? "See what's included" : "How permanent lighting works"}
          </Link>
          <CallLink className="justify-center px-2 py-4 text-bone-300 transition-colors hover:text-champagne-300 sm:ml-2" />
        </div>

        <p className="mt-7 max-w-lg text-sm text-bone-500">{messaging.urgency}</p>
        <p className="mt-2 max-w-lg text-sm text-bone-500">
          {COVERAGE.residential}
        </p>
      </div>
    </section>
  );
}
