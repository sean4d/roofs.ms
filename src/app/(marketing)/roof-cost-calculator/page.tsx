import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { CTASection } from "@/components/tools/cta-section";

import { CostCalculator } from "./calculator";

/**
 * Roof Replacement Cost Calculator (tool #9). A homeowner-friendly estimate
 * entry point that educates and routes to a free inspection / instant estimate.
 * Pricing lives in config/pricing.ts (owner-editable); outputs are ranges only.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roof Cost Calculator in Mississippi | Southeast Roofing",
  description:
    "Estimate a roof replacement cost range in South Mississippi by material, home size, and pitch. Free, instant, no email required — then get an exact price with a free inspection.",
  path: "/roof-cost-calculator",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Roof Cost Calculator", path: "/roof-cost-calculator" },
];

const faqs = [
  {
    question: "How much does a new roof cost in Mississippi?",
    answer:
      "Most residential roof replacements in South Mississippi fall in a range that depends on the material, the size and pitch of your roof, whether the old roof is torn off, and decking condition. This calculator gives an estimated range; a free inspection gives you an exact price.",
  },
  {
    question: "Is this calculator's price a real quote?",
    answer:
      "No. It's an educational estimate to help you plan. Final pricing always requires an on-site inspection because roof condition, access, and hidden issues like rotted decking can change the total.",
  },
  {
    question: "What makes a roof cost more?",
    answer:
      "Steeper pitch, two-story access, a full tear-off of the old roof, replacing damaged decking, premium or metal materials, and adding gutters all increase the total.",
  },
  {
    question: "Does Southeast Roofing offer financing?",
    answer:
      "Yes — $0-down financing is available. The monthly figure shown here is illustrative only; your actual terms depend on the lender and your application.",
  },
];

export default function RoofCostCalculatorPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs)]} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Roof Replacement Cost Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Get an instant, honest estimate range for your roof — no email required.
            Pick your material and a few details to see typical South Mississippi pricing,
            then book a free inspection for your exact number.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <CostCalculator />
      </section>

      {/* FAQ (matches the FAQPage schema above) */}
      <section className="border-t border-border bg-white py-12 sm:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-navy-900">
            Roof cost questions
          </h2>
          <dl className="mt-6 flex flex-col divide-y divide-border">
            {faqs.map((f) => (
              <div key={f.question} className="py-5">
                <dt className="font-semibold text-navy-900">{f.question}</dt>
                <dd className="mt-2 text-slate-600">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CTASection source="cost-calculator" />
    </>
  );
}
