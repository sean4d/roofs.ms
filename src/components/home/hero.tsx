import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Zap } from "lucide-react";

import { siteConfig } from "@/config/site";
import { primaryCta } from "@/config/navigation";
import { hero, heroTrustBar } from "@/content/homepage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WordReveal } from "@/components/motion/word-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { PhoneLink } from "@/components/shared/phone-link";
import { HeroVideo } from "@/components/home/hero-video";

/**
 * Homepage hero (PRD §3.1, owner refinement 2026-07-04): full-bleed
 * cinematic photography with a dark navy overlay, near full-screen on
 * mobile. Four conversion paths: Free Instant Estimate (Roofr) and Free
 * Inspection lead; the two division links ride quieter. Text renders
 * server-side immediately; the background image carries priority loading.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[88svh] items-start overflow-hidden bg-navy-950 lg:min-h-[min(92svh,60rem)] lg:items-center">
      {/* Full-bleed background photography */}
      <Image
        src={hero.photo.src}
        alt={hero.photo.alt}
        fill
        priority
        // Heavy navy overlay hides compression detail, lower quality trims the
        // mobile LCP transfer with no perceptible loss (PageSpeed image-delivery).
        quality={65}
        sizes="100vw"
        className="object-cover object-[center_38%]"
      />
      {/* Mobile only: real roof footage fades in over the photo, plays once,
          fades back. Renders nothing on desktop, on reduced-motion, on
          Save-Data, or on a slow connection, see hero-video.tsx. */}
      <HeroVideo />
      {/* Dark overlay: readable text, premium depth (stronger at the left/bottom where text sits) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/70 to-navy-900/35 lg:bg-gradient-to-r lg:from-navy-950/90 lg:via-navy-950/65 lg:to-navy-900/20"
      />

      {/* Mobile: content rides high under the header (owner request 2026-07-24, 
          no big blank gap at the top). Desktop spacing unchanged. */}
      <div className="container-site relative w-full pt-6 pb-14 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
              <MapPin className="size-3.5 text-steel-300" aria-hidden="true" />
              {hero.locationLine}
            </p>
            {/*
              THE H1 IS THE DESCRIPTOR. THE BRAND LINE IS A TAGLINE BESIDE IT.
              (Revised after an external SEO audit, 2026-09-10.)

              Both lines used to live inside the same h1, so the heading a
              crawler extracted read "Residential & commercial roofing
              contractor in Hattiesburg, MS Roofing done right." Two sentences
              welded together with no punctuation between them, which reads as
              keyword padding rather than as a heading.

              Now the h1 is exactly the descriptor and nothing else, and
              "Roofing done right." is a sibling paragraph. The visual result
              is byte-for-byte what it was: same order, same sizes, same
              colours, same spacing. Only the document semantics changed.
            */}
            <h1 className="mt-5 block font-display text-sm font-semibold tracking-wide text-steel-300 uppercase sm:text-base">
              Residential &amp; commercial roofing contractor in{" "}
              {siteConfig.address.addressLocality},{" "}
              {siteConfig.address.addressRegion}
            </h1>
          </Reveal>

          {/*
            THE BRAND LINE RISES WORD BY WORD, OUTSIDE THE REVEAL ABOVE.

            It used to sit inside that same <Reveal> as the descriptor and the
            subhead, which meant the whole block faded and rose as one slab.
            Giving the biggest line on the page its own motion is the point of
            the effect, and nesting it inside the slab would have run two
            animations over the same pixels at once.

            The two-tone treatment survives: accentFrom/accentTo colour the
            "right." exactly as the span used to, and the accent run is bounded
            so an added tail would not inherit it.
          */}
          <WordReveal
            as="p"
            text={[hero.headline.lead, hero.headline.accent, hero.headline.tail]
              .filter(Boolean)
              .join(" ")}
            accentFrom={hero.headline.lead.split(/\s+/).length}
            accentTo={
              hero.headline.lead.split(/\s+/).length +
              hero.headline.accent.split(/\s+/).length
            }
            delay={0.1}
            className="mt-2 block font-display text-[2.5rem] leading-[1.06] font-bold text-white sm:mt-3 sm:text-5xl lg:text-6xl"
          />

          <Reveal delay={0.3}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel-100 sm:text-xl">
              {hero.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {/*
              The two conversion buttons lean toward the cursor. Only these
              two: the outline division links and the phone row below stay
              still, because the effect means "this is the thing to click"
              and it stops meaning that if everything does it.

              Magnetic renders an inline-block span, so the buttons keep
              w-full on mobile only if the span does too, hence the wrapper
              classes. On a touchscreen the component disables its own
              transform, so a finger never chases a moving target.
            */}
            <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Primary conversion: OUR instant estimator, on our own site.
                  It used to be an external Roofr link opened in a new tab. */}
              <Magnetic className="w-full sm:w-auto">
                <Button
                  size="xl"
                  /* The floating rail watches for this. While it is on screen
                     the rail hides, because two invitations to the same page in
                     one viewport is just clutter. */
                  data-estimate-cta=""
                  className="w-full bg-white text-primary shadow-lg shadow-navy-950/30 hover:bg-steel-100 sm:w-auto"
                  render={<Link href={siteConfig.links.instantEstimate} />}
                  nativeButton={false}
                >
                  <Zap className="size-5" aria-hidden="true" />
                  Free Instant Estimate
                </Button>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Button
                  size="xl"
                  className="w-full bg-navy-700 text-white shadow-lg shadow-navy-950/30 hover:bg-navy-800 sm:w-auto"
                  render={<Link href={primaryCta.href} />}
                  nativeButton={false}
                >
                  {primaryCta.label}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </Magnetic>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                size="xl"
                variant="outline"
                className="w-full border-white/35 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15 sm:w-auto"
                render={<Link href="/residential" />}
                nativeButton={false}
              >
                Residential Roofing
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="w-full border-white/35 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15 sm:w-auto"
                render={<Link href="/commercial" />}
                nativeButton={false}
              >
                Commercial Roofing
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 sm:mt-7">
              <PhoneLink className="text-white" />
              {siteConfig.email && (
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-75"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {/*
          Above-the-fold trust bar (Phase 4 §1): owner-confirmed facts only.
          Horizontal on desktop, clean two-column stack on mobile.
        */}
        <Reveal delay={0.25}>
          {/* Even 4-per-line grid on desktop (owner request 2026-07-05) */}
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3.5 border-t border-white/15 pt-6 sm:pt-7 md:grid-cols-4 lg:mt-14">
            {heroTrustBar.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-xs font-medium text-steel-100 sm:text-[0.8125rem]"
              >
                <item.icon
                  className="size-4 shrink-0 text-steel-300"
                  aria-hidden="true"
                />
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
