import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";

import { primaryCta } from "@/config/navigation";
import { hero } from "@/content/homepage";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * Homepage hero (PRD §3.1): light, airy, photo-led. Text renders
 * server-side immediately; Reveal adds the entrance without gating LCP —
 * the hero photo carries priority loading.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-steel-100),_transparent_55%)]"
      />
      <div className="container-site relative grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-32">
        <div>
          <Reveal>
            <p className="shadow-premium inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-slate-600">
              <MapPin className="size-3.5 text-steel-500" aria-hidden="true" />
              {hero.locationLine}
            </p>
            <h1 className="mt-8 max-w-2xl font-display text-5xl leading-[1.06] font-bold sm:text-6xl lg:text-7xl">
              {hero.headline.lead}{" "}
              <span className="text-gradient-steel">
                {hero.headline.accent}
              </span>
              {hero.headline.tail && ` ${hero.headline.tail}`}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              {hero.subhead}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                render={<Link href={primaryCta.href} />}
                nativeButton={false}
                size="lg"
                className="text-base"
              >
                {primaryCta.label}
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                render={<Link href="/residential" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="text-base"
              >
                Residential Roofing
              </Button>
              <Button
                render={<Link href="/commercial" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="text-base"
              >
                Commercial Roofing
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="size-4 text-success-600"
                  aria-hidden="true"
                />
                {hero.credentialLine}
              </span>
              <PhoneLink className="text-primary" />
            </div>
          </Reveal>
        </div>

        <Reveal as="figure" delay={0.1} className="relative">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="shadow-premium aspect-[4/3] w-full rounded-3xl border border-border object-cover"
            priority
          />
          <figcaption className="absolute bottom-4 left-4 rounded-full border border-border bg-white/95 px-4 py-1.5 text-xs font-medium text-slate-600 backdrop-blur">
            {hero.photoBadge}
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
