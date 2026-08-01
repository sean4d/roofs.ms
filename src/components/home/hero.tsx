import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Zap } from "lucide-react";

import { siteConfig } from "@/config/site";
import { primaryCta } from "@/config/navigation";
import { hero, heroTrustBar } from "@/content/homepage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
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
            <h1 className="mt-5 font-display text-[2.5rem] leading-[1.06] font-bold text-white sm:mt-7 sm:text-5xl lg:text-6xl">
              {hero.headline.lead}{" "}
              <span className="text-steel-300">{hero.headline.accent}</span>
              {hero.headline.tail && ` ${hero.headline.tail}`}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel-100 sm:text-xl">
              {hero.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Primary conversion: Roofr instant estimate, external */}
              <Button
                size="xl"
                className="w-full bg-white text-primary shadow-lg shadow-navy-950/30 hover:bg-steel-100 sm:w-auto"
                render={
                  <a
                    href={siteConfig.links.instantEstimate}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                <Zap className="size-5" aria-hidden="true" />
                Free Instant Estimate
              </Button>
              <Button
                size="xl"
                className="w-full bg-navy-700 text-white shadow-lg shadow-navy-950/30 hover:bg-navy-800 sm:w-auto"
                render={<Link href={primaryCta.href} />}
                nativeButton={false}
              >
                {primaryCta.label}
                <ArrowRight aria-hidden="true" />
              </Button>
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
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3.5 border-t border-white/15 pt-6 md:grid-cols-4 sm:pt-7 lg:mt-14">
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
