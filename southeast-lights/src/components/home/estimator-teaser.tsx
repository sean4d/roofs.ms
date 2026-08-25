import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HOLIDAY } from "@/config/pricing";
import { formatUsd } from "@/lib/utils";

/**
 * Route into the estimator.
 *
 * Previously a glass card containing a glow layer containing the content.
 * Now it is just a band: large type, a rule, and a button. The point of the
 * section is one sentence and one link, so that is what it is.
 */
export function EstimatorTeaser() {
  return (
    <section className="band-tight">
      <div className="container-site">
        <div className="rule-lit" />
        <div className="max-w-3xl pt-12">
          <div>
            <p className="eyebrow text-champagne-500">Price it yourself</p>
            <h2 className="mt-5 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]">
              Light up a house on screen and watch the number move.
            </h2>
            <p className="text-bone-400 mt-5 text-lg leading-relaxed">
              Turn on rooflines, columns, windows, trees and pathways. Pick a
              color. You get a real range in about a minute, and you can send us
              the exact design you built.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/estimator"
              className="btn-primary w-full px-8 py-4 text-base sm:w-auto"
            >
              Build my display
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
            <p className="text-sm text-bone-500">
              Displays start at {formatUsd(HOLIDAY.minimum)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
