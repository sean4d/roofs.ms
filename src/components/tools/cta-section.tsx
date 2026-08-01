"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Phone } from "lucide-react";
import { track } from "@vercel/analytics";

import { siteConfig } from "@/config/site";

/**
 * Reusable conversion block for tools + pages. Surfaces the primary lead
 * actions (free inspection, instant estimate, call) with analytics tracking.
 * `source` labels events so we can see which tool drove the click.
 */
export function CTASection({
  heading = "Ready for a straight answer on your roof?",
  subtext = "Free inspection, honest estimate, no pressure: serving all of South Mississippi.",
  source,
}: {
  heading?: string;
  subtext?: string;
  source?: string;
}) {
  const fire = (action: string) => track("cta_click", { action, source: source ?? "unknown" });

  return (
    <section className="bg-navy-950 py-14 sm:py-20">
      <div className="container-site text-center">
        <h2 className="mx-auto max-w-2xl font-display text-2xl font-bold text-white sm:text-3xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-steel-100/90">{subtext}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {/* Tool pages catch people mid-research, so the low-friction wizard
              leads here, six taps beats a form when you're still exploring. */}
          <Link
            href="/quote"
            onClick={() => fire("quote-wizard")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-navy-900 transition hover:bg-steel-100"
          >
            Get my quote in 6 taps
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <Link
            href="/free-inspection"
            onClick={() => fire("free-inspection")}
            className="inline-flex items-center gap-2 rounded-full border border-steel-500 px-6 py-3 font-semibold text-white transition hover:bg-navy-900"
          >
            Schedule free inspection
          </Link>

          {siteConfig.links.instantEstimate && (
            <a
              href={siteConfig.links.instantEstimate}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fire("instant-estimate")}
              className="inline-flex items-center gap-2 rounded-full border border-steel-500 px-6 py-3 font-semibold text-white transition hover:bg-navy-900"
            >
              <Calculator className="size-4" aria-hidden="true" />
              Instant estimate
            </a>
          )}

          {siteConfig.phone.tel && (
            <a
              href={`tel:${siteConfig.phone.tel}`}
              onClick={() => fire("call")}
              className="inline-flex items-center gap-2 rounded-full border border-steel-500 px-6 py-3 font-semibold text-white transition hover:bg-navy-900"
            >
              <Phone className="size-4" aria-hidden="true" />
              {siteConfig.phone.display}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
