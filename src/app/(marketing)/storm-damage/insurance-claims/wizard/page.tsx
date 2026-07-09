import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";

import { InsuranceWizard } from "./insurance-wizard";

/**
 * Insurance Claim Wizard (tool #8). Guides a storm-damage homeowner to the
 * right next step and captures the lead through the same server action +
 * delivery pipeline as every other form (source: "insurance-wizard").
 */

export const metadata: Metadata = buildMetadata({
  title: "Roof Insurance Claim Help in MS | Southeast Roofing",
  description:
    "Not sure what to do after storm damage? Answer a few questions and Southeast Roofing will point you to the right next step — emergency help, a free inspection before filing, or claim support — with honest, plain-English guidance.",
  path: "/storm-damage/insurance-claims/wizard",
  titleAbsolute: true,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Insurance Claims", path: "/storm-damage/insurance-claims" },
  { name: "Claim Help Wizard", path: "/storm-damage/insurance-claims/wizard" },
];

export default function InsuranceWizardPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-12 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 max-w-2xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Storm damage? Let&apos;s find your next step
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Insurance claims are confusing when you&apos;re dealing with a damaged roof.
            Answer a few quick questions and we&apos;ll point you to exactly what to do
            next — no jargon, no pressure.
          </p>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <InsuranceWizard />
      </section>
    </>
  );
}
