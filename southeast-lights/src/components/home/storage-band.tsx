import Image from "next/image";
import { Boxes, ClipboardCheck, Snowflake } from "lucide-react";

import { IMAGES } from "@/config/images";

/**
 * What happens to the lights in January.
 *
 * The all-inclusive price already covers takedown and storage, and that line
 * appears in the pricing copy, but it reads as boilerplate until someone sees
 * where the boxes actually go. A photograph of a real racked warehouse full of
 * labelled bins does more for the objection than another sentence would: the
 * customer's genuine worry is a garage they lose to six tubs every January,
 * and this answers it by showing them somebody else's building.
 *
 * Sits directly under "why a roofing company" because both make the same
 * argument from different angles. That section says we own the height problem;
 * this one says we own the rest of the year.
 */

const POINTS = [
  {
    icon: Boxes,
    title: "Your display, boxed and racked",
    body: "Every strand comes down in January and goes into bins that stay yours. Nothing is pooled, cut down for another property or thrown at the next customer with a similar roofline.",
  },
  {
    icon: ClipboardCheck,
    title: "Labelled and tracked by property",
    body: "Bins are labelled to the address, and the run lengths, clip counts and colour are recorded with them. That record is why year two goes up faster than year one and looks identical.",
  },
  {
    icon: Snowflake,
    title: "Nothing in your garage",
    body: "No tubs in the attic, no tangle to inherit next November, no strand that half lights when you plug it in. You never store any of it, because storage is part of what you already paid for.",
  },
];

export function StorageBand() {
  return (
    <section className="band relative isolate overflow-hidden bg-ink-900">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card sm:aspect-[3/2] lg:aspect-[4/3]">
          <Image
            src={IMAGES.storageWarehouse.src}
            alt={IMAGES.storageWarehouse.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={IMAGES.storageWarehouse.blurDataURL}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 to-transparent" />
        </div>

        <div>
          <p className="eyebrow text-champagne-500">After the season</p>
          <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            We take it down, and we keep it.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone-300">
            Takedown and storage are in the price, not an add-on you get billed
            for in January. Your lighting comes back to our warehouse, labelled
            to your address, and waits there until next season.
          </p>

          <ul className="mt-9 flex flex-col gap-7">
            {POINTS.map((point) => (
              <li key={point.title} className="flex gap-4">
                <point.icon
                  className="mt-0.5 size-5 shrink-0 text-champagne-400"
                  strokeWidth={1.6}
                />
                <div>
                  <h3 className="font-semibold text-bone-100">{point.title}</h3>
                  <p className="text-bone-400 mt-1.5 leading-relaxed">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
