import { Check } from "lucide-react";

import { QuoteButton } from "@/components/shared/quote-button";
import { HOLIDAY, INCLUDED } from "@/config/pricing";
import { formatUsd } from "@/lib/utils";

/**
 * The all-inclusive service model.
 *
 * Previously this was a background image, an overlay, a bordered price box
 * and seven individual cards. Flattened to two columns and a ruled list: the
 * content is a list, so it is set as a list. Hierarchy comes from type size
 * and whitespace rather than from seven translucent boxes.
 */
export function AllInclusive() {
  return (
    <section className="band border-y border-white/[0.08]">
      <div className="container-site grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-champagne-500">
            One price, the whole season
          </p>
          <h2 className="mt-5 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            We design it, install it, maintain it, then take it down.
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-bone-300">
            The lights stay ours. That is what makes the rest of it work: we
            maintain them through the season, pull them down in January, label
            them, and put them back up next year exactly as they were.
          </p>
          <p className="mt-4 max-w-lg leading-relaxed text-bone-500">
            Nothing goes in your attic. There is no service-call charge when a
            bulb fails. And if you stay with us, your rate stays where it
            started.
          </p>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-4xl font-semibold text-champagne-300">
              {formatUsd(HOLIDAY.roofPerFt)}
            </span>
            <span className="text-lg text-bone-300">per foot of roofline</span>
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-bone-500">
            Displays start at {formatUsd(HOLIDAY.minimum)}. Most homes we do
            land between $1,500 and $5,000 depending on how much of the property
            gets lit.
          </p>

          <QuoteButton location="all_inclusive" className="mt-8" />
        </div>

        <ul className="flex flex-col self-start border-t border-white/[0.08]">
          {INCLUDED.map((item) => (
            <li
              key={item}
              className="flex items-center gap-4 border-b border-white/[0.08] py-4"
            >
              <Check
                className="size-4 shrink-0 text-champagne-400"
                strokeWidth={2.5}
              />
              <span className="text-bone-200">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
