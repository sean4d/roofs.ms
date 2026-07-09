import type { Metadata } from "next";
import {
  CalendarCheck,
  ClipboardCheck,
  FileCheck,
  ShieldCheck,
  Star,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * Free inspection — the primary residential conversion page (PRD §2).
 * 30-second short form; every CTA on the site funnels here.
 */

export const metadata: Metadata = buildMetadata({
  title: "Free Roof Inspection in Hattiesburg, MS | Southeast Roofing",
  description:
    "Schedule a free, no-obligation roof inspection anywhere in South Mississippi. Photo documentation, straight answers, and an itemized digital proposal — from a local, GAF-certified team.",
  path: "/free-inspection",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Free Inspection", path: "/free-inspection" },
];

const reassurance = [
  {
    icon: CalendarCheck,
    title: "We call you back fast",
    text: "Usually the same business day, to find a time that works.",
  },
  {
    icon: ClipboardCheck,
    title: "A real inspection",
    text: "The whole system — shingles, flashing, decking, ventilation — documented with photos.",
  },
  {
    icon: FileCheck,
    title: "An itemized proposal",
    text: "Straight to your email, priced line by line, upgrades you can toggle. No hidden fees, no pressure.",
  },
];

export default function FreeInspectionPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="bg-secondary">
        <div className="container-site grid gap-12 py-14 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Your free roof inspection
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Thirty seconds to fill out. No cost, no obligation, and a straight
              answer about your roof — including when the honest answer is that
              it&apos;s fine.
            </p>

            <ul className="mt-10 space-y-6">
              {reassurance.map((item) => (
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
                <Star className="size-4 text-steel-500" aria-hidden="true" />
                5-star Google rating
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="size-4 text-steel-500"
                  aria-hidden="true"
                />
                GAF Certified · MS License #R22245
              </span>
            </div>
            <p className="mt-6 text-sm text-slate-600">
              Rather talk to a person right now?{" "}
              <PhoneLink className="text-navy-900" />
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <LeadForm variant="short" source="free-inspection" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
