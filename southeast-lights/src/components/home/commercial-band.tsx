import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { IMAGES } from "@/config/images";
import { commercialCta } from "@/config/navigation";
import { verticalsByPriority } from "@/config/verticals";

/**
 * The commercial and large-property band.
 *
 * Given more visual weight than the residential sections on purpose: this is
 * where a $10,000 to $50,000 project comes from. A board evaluating a large
 * contract should hit this and immediately read "serious contractor" rather
 * than "seasonal side business".
 */
export function CommercialBand() {
  const verticals = verticalsByPriority().slice(0, 8);

  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 py-20 lg:py-28">
      <Image
        src={IMAGES.hoaEntrance.src}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        blurDataURL={IMAGES.hoaEntrance.blurDataURL}
        className="-z-10 object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/70" />

      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow text-champagne-500">
            HOAs, communities &amp; commercial
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Built for the projects that need a real contractor.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-bone-300">
            Entrance monuments, boulevards, campuses, retail centers and
            hospitality properties. Insured crews, boom lifts and articulating
            equipment, written scopes, certificates of insurance and design
            concepts a board can actually vote on.
          </p>
          <p className="mt-4 leading-relaxed text-bone-500">
            For projects of real scale we travel statewide. Distance is a
            scheduling question, not a reason to say no.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={commercialCta.href} className="btn-primary">
              {commercialCta.label}
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
            <Link href="/commercial" className="btn-secondary">
              See commercial capabilities
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {verticals.map((vertical) => (
            <li key={vertical.slug}>
              <Link
                href={`/commercial/${vertical.slug}`}
                className="card-lit group flex h-full items-center justify-between gap-3 px-5 py-4"
              >
                <span className="text-sm font-medium text-bone-100">
                  {vertical.label}
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-bone-500 transition-all group-hover:translate-x-0.5 group-hover:text-champagne-400"
                  strokeWidth={2}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
