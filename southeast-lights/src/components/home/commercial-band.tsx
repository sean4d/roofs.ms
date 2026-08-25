import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { commercialCta } from "@/config/navigation";
import { verticalsByPriority } from "@/config/verticals";

/**
 * Commercial and HOA.
 *
 * This is the most important section on the homepage and it is now built to
 * look like it: a full-bleed editorial band with real image scale rather than
 * a row of small chips over a washed-out background. A board evaluating a
 * $50,000 contract should hit this and see the size of work we do.
 *
 * The three leading verticals get large imagery. The rest are a plain list,
 * because a list of nine equally-weighted cards is exactly the flattening
 * problem: everything shouted, nothing heard.
 */
export function CommercialBand() {
  const all = verticalsByPriority();
  const featured = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <section className="band border-y border-white/[0.08] bg-ink-900">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-champagne-500">
              HOAs, communities &amp; commercial
            </p>
            <h2 className="mt-5 text-3xl font-semibold text-balance sm:text-4xl lg:text-[3rem] lg:leading-[1.06]">
              The projects that need a real contractor.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-300">
              Entrance monuments, boulevards, church campuses, resort drives and
              retail centers. Insured crews, boom lifts and articulating
              equipment, and paperwork a board can act on without a second
              meeting.
            </p>
          </div>
          <Link
            href={commercialCta.href}
            className="btn-primary shrink-0 px-7 py-4 text-base"
          >
            Request a proposal
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Featured verticals: real image scale, aligned bottoms. */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {featured.map((vertical, index) => (
            <Link
              key={vertical.slug}
              href={`/commercial/${vertical.slug}`}
              className={`group cell overflow-hidden rounded-card border border-white/[0.09] transition-colors hover:border-champagne-400/40 ${
                index === 0 ? "lg:col-span-1" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[3/2]">
                <Image
                  src={vertical.image.src}
                  alt={vertical.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={vertical.image.blurDataURL}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-xl font-semibold">{vertical.label}</h3>
                <p className="text-bone-400 mt-3 leading-relaxed">
                  {vertical.summary}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-champagne-300">
                  See details
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Everything else: a plain ruled list, deliberately quieter. */}
        <ul className="mt-12 grid border-t border-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((vertical) => (
            <li key={vertical.slug}>
              <Link
                href={`/commercial/${vertical.slug}`}
                className="group flex items-center justify-between gap-4 border-b border-white/[0.08] py-4 pr-2 text-bone-300 transition-colors hover:text-champagne-300 sm:pr-8"
              >
                {vertical.label}
                <ArrowUpRight
                  className="text-bone-600 size-4 shrink-0 transition-colors group-hover:text-champagne-400"
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
