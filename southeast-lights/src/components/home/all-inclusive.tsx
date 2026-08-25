import Image from "next/image";
import { Check } from "lucide-react";

import { QuoteButton } from "@/components/shared/quote-button";
import { IMAGES } from "@/config/images";
import { HOLIDAY, INCLUDED } from "@/config/pricing";
import { formatUsd } from "@/lib/utils";

/**
 * The all-inclusive service model.
 *
 * This is the most under-sold fact in the business and the reason it gets a
 * full band rather than a bullet: the seasonal product is a service, not a
 * purchase. The lights stay ours, which is exactly why maintenance, takedown
 * and storage are included rather than billed later.
 *
 * The old Wix site never said any of this.
 */
export function AllInclusive() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 py-20 lg:py-28">
      <Image
        src={IMAGES.storageWarehouse.src}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        blurDataURL={IMAGES.storageWarehouse.blurDataURL}
        className="-z-10 object-cover opacity-[0.16]"
      />
      <div className="absolute inset-0 -z-10 bg-ink-950/85" />

      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow text-champagne-500">One price. The entire season.</p>
          <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            We design it, install it, maintain it, remove it and store it.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone-300">
            Seasonal lighting stays our property. That is what makes the rest
            of it possible: because the lights are ours, we are the ones who
            maintain them, take them down, label them and bring them back next
            year. Nothing ends up in your attic.
          </p>
          <p className="mt-4 max-w-lg leading-relaxed text-bone-500">
            One agreed price up front covers the whole season. No service-call
            charges for normal failures, and the rate does not climb in year
            two.
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 rounded-card border border-champagne-400/25 bg-champagne-400/[0.06] px-6 py-5">
            <span className="font-display text-3xl font-semibold text-champagne-300">
              {formatUsd(HOLIDAY.roofPerFt)}/ft
            </span>
            <span className="text-bone-300">roofline, installed</span>
            <span className="w-full text-sm text-bone-500">
              Professional residential displays begin at{" "}
              {formatUsd(HOLIDAY.minimum)}. Most projects land between $1,500
              and $5,000 depending on scope.
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <QuoteButton location="all_inclusive" />
          </div>
        </div>

        <ul className="grid gap-3 self-start sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="card-lit flex items-start gap-3 px-5 py-4">
              <Check
                className="mt-0.5 size-4 shrink-0 text-champagne-400"
                strokeWidth={2.5}
              />
              <span className="text-sm text-bone-200">{item}</span>
            </li>
          ))}
          <li className="card-lit flex items-start gap-3 px-5 py-4 sm:col-span-2">
            <Check
              className="mt-0.5 size-4 shrink-0 text-champagne-400"
              strokeWidth={2.5}
            />
            <span className="text-sm text-bone-200">
              Never climb a ladder again
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
