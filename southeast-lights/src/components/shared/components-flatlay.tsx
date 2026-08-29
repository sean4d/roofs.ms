import Image from "next/image";

import { COMPONENTS_FLATLAY } from "@/config/images";

/**
 * The hardware that goes into one display.
 *
 * Renders nothing until the photo is ingested, so the section can ship ahead
 * of the file and light up on the next upload with no code change.
 */
export function ComponentsFlatlay({
  tone = "raised",
}: {
  tone?: "ink" | "raised";
}) {
  if (!COMPONENTS_FLATLAY) return null;

  return (
    <section
      className={
        tone === "raised"
          ? "band border-y border-white/10 bg-ink-900"
          : "band border-b border-white/10"
      }
    >
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <figure className="min-w-0">
          <div className="relative overflow-hidden rounded-card border border-white/[0.09]">
            <Image
              src={COMPONENTS_FLATLAY.src}
              alt={COMPONENTS_FLATLAY.alt}
              width={COMPONENTS_FLATLAY.width}
              height={COMPONENTS_FLATLAY.height}
              placeholder="blur"
              blurDataURL={COMPONENTS_FLATLAY.blurDataURL}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </figure>

        <div className="min-w-0">
          <p className="eyebrow text-champagne-500">
            What a display is made of
          </p>
          <h2 className="mt-5 text-3xl font-semibold text-balance sm:text-4xl">
            None of this comes out of a box.
          </h2>
          <p className="mt-6 leading-relaxed text-bone-300">
            Every strand is built for your house on the day we install it. We
            measure the run, cut commercial-grade SPT-2 wire to length, and set
            a socket every twelve inches so the spacing stays even from one end
            of the roof to the other.
          </p>
          <p className="text-bone-400 mt-4 leading-relaxed">
            Clips are matched to whatever they are gripping, whether that is a
            shingle edge, a gutter lip, a fascia board or a brick column.
            Nothing is stapled, nailed or run through your attic.
          </p>
          <p className="text-bone-400 mt-4 leading-relaxed">
            The pole, the snips and a box of spare bulbs stay on the truck all
            season. When a bulb goes out in December, replacing it is our job,
            and there is no service charge for the visit.
          </p>
        </div>
      </div>
    </section>
  );
}
