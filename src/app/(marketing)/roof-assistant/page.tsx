import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";

import { RoofAssistant } from "./assistant";

/**
 * AI Roof Assistant (tool #1). Guided, assistant-style triage that routes the
 * visitor to the right next step. The analysis layer is provider-abstracted
 * (lib/ai/roof-assistant) so a real vision model drops in later.
 */

export const metadata: Metadata = buildMetadata({
  title: "AI Roof Assistant in Mississippi | Southeast Roofing",
  description:
    "Tell the Southeast Roofing assistant what's going on — leak, storm damage, replacement, insurance, and more — and get pointed to the right next step in seconds. Free, no obligation.",
  path: "/roof-assistant",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Roof Assistant", path: "/roof-assistant" },
];

export default function RoofAssistantPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Not sure what your roof needs?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Answer one quick question and our Roof Assistant points you to exactly the
            right next step — a free inspection, an instant estimate, insurance help, or
            a phone call. No pressure, no jargon.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <RoofAssistant />
      </section>
    </>
  );
}
