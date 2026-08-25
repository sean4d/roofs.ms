import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { IMAGES } from "@/config/images";

/**
 * Top-of-funnel segmentation.
 *
 * Three routes, and the weighting is the message: HOA takes the full-height
 * left column, commercial and residential stack beside it. Uniform card
 * heights come from the grid rather than from min-heights, and each cell's
 * text block sits at the same offset so the headings line up.
 */
const SEGMENTS = [
  {
    href: "/commercial/hoa-communities",
    label: "HOA & Communities",
    blurb:
      "Entrances, boulevards and common areas designed as one display, with proposals a board can vote on.",
    image: IMAGES.hoaEntrance,
  },
  {
    href: "/commercial",
    label: "Commercial",
    blurb:
      "Churches, cities, hotels, clubs and retail. Insured crews and lift equipment.",
    image: IMAGES.retailCenter,
  },
  {
    href: "/holiday-lighting/residential",
    label: "Residential",
    blurb: "Premium homes across the Pine Belt, starting at $1,000.",
    image: IMAGES.colonialColumns,
  },
] as const;

export function SegmentPicker() {
  const [lead, ...rest] = SEGMENTS;

  return (
    <section className="band">
      <div className="container-site">
        <p className="eyebrow text-champagne-500">
          Where do you need lighting?
        </p>
        <h2 className="mt-5 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          A board and a homeowner need different things from us.
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <SegmentTile segment={lead} priority />
          <div className="grid gap-5">
            {rest.map((segment) => (
              <SegmentTile key={segment.href} segment={segment} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SegmentTile({
  segment,
  compact,
  priority,
}: {
  segment: (typeof SEGMENTS)[number];
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={segment.href}
      className="group relative isolate flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-card p-7 lg:min-h-0"
    >
      <Image
        src={segment.image.src}
        alt=""
        fill
        priority={priority}
        sizes={
          compact
            ? "(max-width: 1024px) 100vw, 33vw"
            : "(max-width: 1024px) 100vw, 50vw"
        }
        placeholder="blur"
        blurDataURL={segment.image.blurDataURL}
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="scrim-soft absolute inset-0 -z-10" />

      <h3
        className={
          compact
            ? "text-xl font-semibold"
            : "text-2xl font-semibold sm:text-3xl"
        }
      >
        {segment.label}
      </h3>
      <p className="mt-2.5 max-w-sm leading-relaxed text-bone-300">
        {segment.blurb}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-champagne-300">
        Explore
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}
