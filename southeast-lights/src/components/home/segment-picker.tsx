import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { IMAGES } from "@/config/images";

/**
 * Top-of-funnel segmentation: Residential, Commercial, HOA & Communities.
 *
 * Commercial and HOA are given more visual weight than residential on
 * purpose. Residential work is the volume business; HOA and commercial work
 * is where a $10,000 to $50,000 project comes from, so those routes get the
 * larger cells and the stronger imagery.
 */
const SEGMENTS = [
  {
    href: "/commercial/hoa-communities",
    label: "HOA & Communities",
    blurb:
      "Entrances, boulevards and common areas designed as one display, with board-ready proposals.",
    image: IMAGES.hoaEntrance,
    span: "lg:col-span-5",
  },
  {
    href: "/commercial",
    label: "Commercial",
    blurb:
      "Churches, municipalities, hotels, clubs, retail and corporate properties. Insured, lift-equipped crews.",
    image: IMAGES.retailCenter,
    span: "lg:col-span-4",
  },
  {
    href: "/holiday-lighting/residential",
    label: "Residential",
    blurb: "Premium homes across the Pine Belt, from $1,000.",
    image: IMAGES.colonialColumns,
    span: "lg:col-span-3",
  },
] as const;

export function SegmentPicker() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container-site">
        <p className="eyebrow text-champagne-500">Where do you need lighting?</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Three ways in, because a board and a homeowner need different things.
        </h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {SEGMENTS.map((segment) => (
            <Link
              key={segment.href}
              href={segment.href}
              className={`card-lit group relative isolate flex min-h-[19rem] flex-col justify-end overflow-hidden p-7 lg:min-h-[23rem] ${segment.span}`}
            >
              <Image
                src={segment.image.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL={segment.image.blurDataURL}
                className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="scrim-soft absolute inset-0 -z-10" />

              <h3 className="text-2xl font-semibold">{segment.label}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone-300">
                {segment.blurb}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-champagne-300">
                Explore
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
