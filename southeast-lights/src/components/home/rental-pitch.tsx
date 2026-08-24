import { Check } from "lucide-react";

import { HOLIDAY, INCLUDED } from "@/config/pricing";
import { formatUsd } from "@/lib/utils";

/**
 * The most under-sold fact in this business, and the reason it deserves a
 * full section rather than a bullet: the holiday product is a RENTAL. The
 * lights stay ours. The customer buys nothing, stores nothing, untangles
 * nothing, and repairs nothing.
 *
 * The previous Wix site never said any of this.
 */
export function RentalPitch() {
  return (
    <section className="bg-white py-24">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-display text-xs tracking-[0.18em] text-glow-600 uppercase">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold text-balance sm:text-4xl">
            You are renting a finished display, not buying a box of lights.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            The lights are ours. We cut them to your roofline, install them,
            fix anything that fails mid-season, take them down, label them, and
            store them until next year. Nothing lives in your attic.
          </p>
          <p className="mt-4 max-w-lg text-slate-600">
            One rate covers all of it, and it does not creep upward in year
            two. Existing customers get first pick of install dates before we
            open the calendar.
          </p>

          <div className="mt-8 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-card border border-[#d8dee6] bg-[#f5f7fa] px-5 py-4">
            <span className="font-display text-3xl font-bold text-navy-800">
              {formatUsd(HOLIDAY.roofPerFt)}
            </span>
            <span className="text-slate-600">per foot of roofline</span>
            <span className="w-full text-sm text-slate-600">
              {formatUsd(HOLIDAY.minimum)} minimum. Two-story and steep roofs
              (over 9/12) add {formatUsd(HOLIDAY.surcharge.twoStory)} per foot
              each.
            </span>
          </div>
        </div>

        <ul className="grid gap-3 self-start sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {INCLUDED.map((item) => (
            <li
              key={item}
              className="card-day flex items-start gap-3 px-5 py-4 text-sm"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-glow-600"
                strokeWidth={2}
              />
              <span className="text-[#2b2f33]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
