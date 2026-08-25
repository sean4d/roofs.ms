import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { HOLIDAY } from "@/config/pricing";
import { formatUsd } from "@/lib/utils";

/**
 * Drives traffic into the estimator, and does qualification work on the way.
 *
 * Stating the $1,000 floor here is deliberate: the estimator exists partly
 * because people assumed a full professional display costs $200-$300. Better
 * that expectation is corrected on the homepage than on a phone call.
 */
export function EstimatorTeaser() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container-site">
        <div className="card-lit relative isolate overflow-hidden px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="glow-top absolute inset-x-0 -top-24 -z-10 h-48" />

          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow inline-flex items-center gap-2 text-champagne-400">
                <Sparkles className="size-3.5" strokeWidth={2} />
                Design it yourself
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl">
                Light up your house on screen and see the price.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-bone-300">
                Pick your rooflines, columns, windows, trees and pathways and
                watch them illuminate. Choose a colour scheme. Get a real
                estimate range in about a minute, then send us the exact design
                you built.
              </p>
              <p className="mt-4 text-sm text-bone-500">
                Professional residential displays begin at{" "}
                {formatUsd(HOLIDAY.minimum)}. The estimator will never quote
                you less.
              </p>
            </div>

            <Link href="/estimator" className="btn-primary shrink-0 px-8 py-4 text-base">
              Build my display
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
