import Image from "next/image";
import Link from "next/link";

import type { BreadcrumbItem } from "@/lib/schema";
import type { ServiceContent } from "@/content/services/types";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { PhoneLink } from "@/components/shared/phone-link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * Service hero (PRD §4.1.1): breadcrumb, H1, subhead, dual CTA (free
 * inspection + call), service imagery. Light interior treatment — the dark
 * cinematic hero stays homepage-only.
 */
export function ServiceHero({
  hero,
  breadcrumbs,
  audience = "residential",
}: {
  hero: ServiceContent["hero"];
  breadcrumbs: BreadcrumbItem[];
  /** Commercial pages swap the CTA to the consultation flow (PRD §4.2). */
  audience?: "residential" | "commercial";
}) {
  const cta =
    audience === "commercial"
      ? {
          label: "Request a Consultation",
          href: "/commercial/request-consultation",
        }
      : { label: "Schedule Free Inspection", href: "/free-inspection" };

  return (
    <section className="border-b border-border bg-secondary">
      <div className="container-site grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <Reveal>
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-6 text-sm font-semibold tracking-wide text-steel-500 uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            {hero.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="text-base"
              render={<Link href={cta.href} />}
              nativeButton={false}
            >
              {cta.label}
            </Button>
            <PhoneLink className="text-base text-navy-900" />
          </div>
        </Reveal>

        {hero.photo ? (
          <Reveal delay={0.1} className="relative">
            <Image
              src={hero.photo.src}
              alt={hero.photo.alt}
              width={1000}
              height={750}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="shadow-premium aspect-[4/3] w-full rounded-3xl border border-border object-cover"
            />
            {hero.photoBadge && (
              <span className="absolute bottom-4 left-4 rounded-full bg-navy-950/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
                {hero.photoBadge}
              </span>
            )}
          </Reveal>
        ) : (
          /* Photo-free treatment until honest service imagery exists */
          <Reveal
            delay={0.1}
            className="shadow-premium relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-navy-900 p-8"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-steel-300) 1px, transparent 1px), linear-gradient(90deg, var(--color-steel-300) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            {hero.chips && (
              <ul className="relative flex max-w-sm flex-wrap justify-center gap-3">
                {hero.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
