import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";

import { DamageAnalyzer } from "./damage-analyzer";

/**
 * Roof Damage Photo Analyzer (tool #5). Upload photos + describe the issue,
 * get a preliminary read, and request a free inspection. Analysis is
 * provider-abstracted (lib/ai/damage-analyzer) for real vision later; the lead
 * flows through the same submitLead pipeline (source: "damage-analyzer").
 */

export const metadata: Metadata = buildMetadata({
  title: "Roof Damage Photo Analyzer — Mississippi",
  description:
    "See roof damage and not sure how bad it is? Upload photos, tell us what you're seeing, and get a preliminary read plus a free inspection from Southeast Roofing. Storm and insurance-ready.",
  path: "/roof-damage-analyzer",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Roof Damage Analyzer", path: "/roof-damage-analyzer" },
];

export default function RoofDamageAnalyzerPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Think your roof is damaged? Let&apos;s take a look
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Upload a few photos and tell us what you&apos;re seeing. We&apos;ll give you a
            quick, honest read on what it might be and how urgent it is — then set up a
            free, in-person inspection to confirm it.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <DamageAnalyzer />
      </section>
    </>
  );
}
