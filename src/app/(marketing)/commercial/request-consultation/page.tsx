import type { Metadata } from "next";
import {
  Building2,
  ClipboardCheck,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { CommercialForm } from "@/components/forms/commercial-form";
import { Reveal } from "@/components/motion/reveal";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * Commercial consultation flow (PRD §4.2): dedicated form with
 * "commercial" tagging so the owner can triage. Consultation framing —
 * no instant-quote language.
 */

export const metadata: Metadata = buildMetadata({
  title: "Request a Commercial Roofing Consultation | South Mississippi",
  description:
    "Request a commercial roofing consultation from Southeast Roofing — assessment, engineered proposal, and honest guidance for facilities across South Mississippi.",
  path: "/commercial/request-consultation",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Commercial Roofing", path: "/commercial" },
  { name: "Request Consultation", path: "/commercial/request-consultation" },
];

const expectations = [
  {
    icon: Building2,
    title: "A conversation about your building",
    text: "Property type, operations, budget cycle — we listen before we look.",
  },
  {
    icon: ClipboardCheck,
    title: "A real assessment",
    text: "Condition documented with photos; moisture data where the decision needs it.",
  },
  {
    icon: FileCheck,
    title: "An engineered proposal",
    text: "System options itemized line by line — written for boards, owners, and procurement.",
  },
];

export default function RequestConsultationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="bg-secondary">
        <div className="container-site grid gap-12 py-14 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Request a commercial consultation
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              No instant quotes, no pressure — commercial roofs deserve a real
              conversation. Tell us about the building and we&apos;ll take it
              from there.
            </p>

            <ul className="mt-10 space-y-6">
              {expectations.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                    <item.icon
                      className="size-5 text-steel-500"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h2 className="font-display font-semibold">{item.title}</h2>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="size-4 text-steel-500"
                  aria-hidden="true"
                />
                MS License #R22245 · Fully insured & bonded
              </span>
            </div>
            <p className="mt-6 text-sm text-slate-600">
              Prefer to start by phone? <PhoneLink className="text-navy-900" />
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <CommercialForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
