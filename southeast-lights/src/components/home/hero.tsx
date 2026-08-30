import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

import { Snowfall } from "@/components/effects/snowfall";
import { CallLink } from "@/components/shared/contact-actions";
import { QuoteButton } from "@/components/shared/quote-button";
import { IMAGES } from "@/config/images";
import { messagingFor, type SeasonMode } from "@/config/season";

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
  /*
   * Desktop background. The live oak wrap is the strongest photograph in
   * the set and it reads at full-bleed width, which a roofline shot does
   * not: a roof crops to a stripe across a 2400px hero, a wrapped canopy
   * fills the frame. Off season the permanent-lighting colour shot takes
   * over. Phones keep their own portrait image below, untouched.
   */
  const image = holiday ? IMAGES.liveOakWrap : IMAGES.permanentColor;
  /*
   * Phones get a portrait photograph of an install in progress. A wide hero
   * crops to a strip on a phone, and the vertical frame is the only shape
   * that can show how far up the work happens.
   *
   * Holiday mode only. In the off season the hero sells permanent lighting,
   * and a photograph of someone clipping C9 to a rake argues against it.
   */
  const phoneImage = holiday ? IMAGES.heroMobileInstall : null;
  const messaging = messagingFor(mode, now);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/*
         * Art direction without paying for it twice. Both elements render,
         * but each one's `sizes` collapses to 1px at the breakpoint where it
         * is hidden, so the browser picks the smallest candidate in the
         * srcSet for the one it is not showing. This is the LCP element, so
         * downloading two full heroes would be a real cost.
         */}
        {phoneImage ? (
          <Image
            src={phoneImage.src}
            alt={phoneImage.alt}
            fill
            priority
            sizes="(min-width: 768px) 1px, 100vw"
            placeholder="blur"
            blurDataURL={phoneImage.blurDataURL}
            style={{ objectPosition: phoneImage.focus ?? "center" }}
            className="object-cover md:hidden"
          />
        ) : null}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes={phoneImage ? "(min-width: 768px) 100vw, 1px" : "100vw"}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          style={{ objectPosition: image.focus ?? "center" }}
          className={
            phoneImage ? "hidden object-cover md:block" : "object-cover"
          }
        />
        {/*
         * The hero scrim is directional: heavy at the left where a wide
         * headline sits, clearing to the right so the photograph survives.
         * On a phone there is no right to clear to, the text spans the full
         * width, so a left-weighted wash just dims the whole picture. Phones
         * get a bottom-weighted scrim instead, which keeps the top of the
         * frame, and the person working in it, legible.
         */}
        <div className="scrim-hero-phone absolute inset-0 md:hidden" />
        <div className="scrim-hero absolute inset-0 hidden md:block" />
      </div>

      {holiday ? <Snowfall /> : null}

      <div
        /*
         * pt-32 was clearing a header that does not need clearing. The header
         * is sticky, not fixed, so it occupies layout and the hero already
         * starts below it: that padding was 128px of nothing on top of an
         * 80px header, and justify-end on a 72svh box pushed the rest down
         * again. On a phone that spent a third of the first viewport before
         * the badge. Content now starts just under the header and the box is
         * sized so the photograph still gets room beneath the CTA.
         */
        className="container-site relative z-20 flex min-h-[66svh] flex-col justify-start pt-8 pb-14 sm:min-h-[78svh] sm:justify-end sm:pt-28 lg:min-h-[88svh] lg:pt-32 lg:pb-24"
      >
        <Reveal>
          {/*
           * Two chips, deliberately unequal.
           *
           * The first says where we are, and it comes first because "local" is
           * the strongest single signal a lighting customer looks for. It is
           * the louder of the two: warmer ground, brighter border, a pin, the
           * same shape the roofing site uses.
           *
           * The second is the seasonal booking note. It still matters, but it
           * is a detail next to who we are, so it sits underneath at a smaller
           * size rather than competing for the same attention.
           */}
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-champagne-400/55 bg-champagne-400/[0.12] px-4 py-2 text-[0.8125rem] font-semibold text-champagne-200 backdrop-blur-sm sm:text-sm">
            <MapPin
              className="size-4 shrink-0 text-champagne-400"
              strokeWidth={2}
            />
            <span>
              Hattiesburg, Mississippi
              <span className="mx-1.5 text-champagne-400/70">&middot;</span>
              <span className="font-medium text-champagne-300/95">
                Serving all of South Mississippi
              </span>
            </span>
          </p>

          <p className="eyebrow mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/[0.12] bg-ink-950/45 px-2.5 py-1 text-[0.625rem] text-bone-300 backdrop-blur-sm">
            <span className="size-1 rounded-full bg-champagne-400 motion-safe:animate-twinkle" />
            {messaging.badge}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-4xl text-[2.05rem] leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-7xl lg:leading-[1.03]">
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
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 max-w-xl leading-relaxed text-bone-300 sm:text-lg">
            {holiday
              ? "All-inclusive holiday lighting for premium homes, HOAs, communities and commercial properties. We design it, install it, maintain it, take it down and store it. You never touch a ladder."
              : "Permanent architectural, landscape and exterior lighting installed by a licensed roofing contractor. Warm white every evening, full color for every holiday, and nothing to put up or take down."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuoteButton
              location="hero"
              className="w-full px-7 py-4 text-base sm:w-auto"
            />
            <Link
              href={
                holiday
                  ? "/holiday-lighting"
                  : "/services/permanent-architectural-lighting"
              }
              className="btn-secondary w-full px-7 py-4 text-base sm:w-auto"
            >
              {holiday ? "See what's included" : "How permanent lighting works"}
            </Link>
            <CallLink className="justify-center px-2 py-4 text-bone-300 transition-colors hover:text-champagne-300 sm:ml-2" />
          </div>

          <p className="mt-8 max-w-lg text-sm leading-relaxed text-bone-500">
            {messaging.urgency}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
