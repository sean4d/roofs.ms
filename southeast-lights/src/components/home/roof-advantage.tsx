import Image from "next/image";
import { Ban, HardHat, Wrench } from "lucide-react";

import { IMAGES } from "@/config/images";

/**
 * The roofing-contractor advantage. This is the single strongest thing
 * Southeast Lights can say that no competitor can copy, so it gets its own
 * band rather than a line in a list.
 *
 * The tone is deliberately a little pointed. It is also carefully bounded:
 * we claim "no unnecessary penetrations" and describe the actual method,
 * rather than an absolute "no roof damage" warranty we could not honour.
 */
const POINTS = [
  {
    icon: HardHat,
    title: "Roof-trained crews, not seasonal help",
    body: "The people on your roof in November are on roofs in July. They read pitch, set ladders properly, move on shingles without scuffing them, and know which attachment points are safe. Falls from ladders and roofs injure thousands of people every holiday season, and most of them are homeowners.",
  },
  {
    icon: Ban,
    title: "No holes. No unnecessary penetrations.",
    body: "Standard installations use non-penetrating clips designed for shingles, gutters and trim, plus hot glue where a clip will not hold. We do not use staples, screws or nails unless a customer specifically requests a different method and we agree to it in writing.",
  },
  {
    icon: Wrench,
    title: "Professional equipment for the work",
    body: "Residential crews carry professional ladders and roof-traction footwear and pitch equipment for steep work. Commercial installations use boom lifts, bucket trucks and articulating lifts. Nothing about this job should involve balancing on a dining chair.",
  },
];

export function RoofAdvantage() {
  return (
    <section className="relative isolate overflow-hidden py-20 lg:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:order-2">
          <Image
            src={IMAGES.installerRoof.src}
            alt={IMAGES.installerRoof.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={IMAGES.installerRoof.blurDataURL}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 to-transparent" />
        </div>

        <div className="lg:order-1">
          <p className="eyebrow text-champagne-500">Why a roofing company</p>
          <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Your roof isn&rsquo;t the place to hire the cheapest guy with a
            ladder.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone-300">
            Southeast Lights is the lighting division of a licensed roofing
            contractor. The hazard in this job was never the lights. It is the
            height, and it is the roof underneath.
          </p>

          <div className="mt-9 flex flex-col gap-7">
            {POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-champagne-400/25 bg-champagne-400/[0.08] text-champagne-400">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{point.title}</h3>
                    <p className="mt-2 leading-relaxed text-bone-500">
                      {point.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
