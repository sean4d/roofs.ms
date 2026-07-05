import type { Metadata } from "next";
import { BadgeCheck, ShieldCheck, Star } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { Reveal } from "@/components/motion/reveal";

/**
 * Interactive quote wizard page (PRD §13 Phase 8, first mini-project).
 * The wizard qualifies the request in six taps and feeds the standard
 * lead pipeline; no computed pricing — Roofr stays the instant-number
 * tool, offered on the success screen.
 */

export const metadata: Metadata = buildMetadata({
  title: "Get a Roofing Quote | Southeast Roofing",
  description:
    "Answer six quick questions and get a real, itemized roofing quote from a Mississippi-licensed contractor — residential or commercial, no spam, no pressure.",
  path: "/quote",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Get a Quote", path: "/quote" },
];

const trustChips = [
  { icon: Star, label: siteConfig.trustFacts.googleRating },
  { icon: ShieldCheck, label: siteConfig.trustFacts.insured },
  { icon: BadgeCheck, label: "Itemized proposals — every line priced" },
];

export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-14">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Six taps to your quote
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              Tell us what you&apos;re dealing with and a real person — not an
              algorithm — puts together your itemized quote. Takes about a
              minute.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {trustChips.map((chip) => (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-900"
                >
                  <chip.icon
                    className="size-4 text-steel-500"
                    aria-hidden="true"
                  />
                  {chip.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="container-site max-w-3xl">
          <Reveal>
            <QuoteWizard />
          </Reveal>
        </div>
      </section>
    </>
  );
}
