import type { Metadata } from "next";
import {
  ClipboardCheck,
  HardHat,
  Handshake,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";

/**
 * Careers page (PRD §13 Phase 6 — basic). Integrity rule: no fabricated
 * open positions, salaries, or benefits. This page describes the kinds of
 * people we hire and how to reach us; JobPosting schema gets added only
 * when the owner supplies real, dated openings.
 */

export const metadata: Metadata = buildMetadata({
  title: "Roofing Careers in Hattiesburg, MS | Southeast Roofing",
  description:
    "Southeast Roofing is always interested in meeting skilled roofers, project consultants, and office talent in South Mississippi. Introduce yourself.",
  path: "/careers",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
];

const roles = [
  {
    icon: HardHat,
    title: "Roofing crews & crew leads",
    text: "Experienced installers across shingle, metal, and flat systems — people who take pride in straight lines, clean flashing, and a spotless site at the end of the day.",
  },
  {
    icon: Handshake,
    title: "Sales & project consultants",
    text: "People who can walk a roof, explain what they found in plain English, and guide a homeowner or property manager through an itemized proposal without pressure tactics.",
  },
  {
    icon: ClipboardCheck,
    title: "Office & operations",
    text: "The coordination behind every smooth job: scheduling, permitting, material orders, insurance documentation, and keeping customers informed start to finish.",
  },
];

const expectations = [
  {
    icon: ShieldCheck,
    title: "Safety is non-negotiable",
    text: "Harnesses on, sites secured, no shortcuts — the job is only done right if everyone goes home right.",
  },
  {
    icon: TrendingUp,
    title: "Craft over speed",
    text: "We'd rather explain why a job took an extra half-day than apologize for a leak. Our reviews are public; your work is what earns them.",
  },
  {
    icon: Handshake,
    title: "Straight with customers",
    text: "We put a price on every line item and never sell work a roof doesn't need. If that's how you already operate, you'll fit in.",
  },
];

export default function CareersPage() {
  const mailto = siteConfig.email
    ? `mailto:${siteConfig.email}?subject=${encodeURIComponent("Careers — introduction")}`
    : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Build with a crew that does it right
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Southeast Roofing is a growing, Mississippi-licensed contractor
              based in Hattiesburg. We don&apos;t post ghost listings — when
              we&apos;re hiring, it&apos;s because the work is real and the
              standard is high. If that sounds like you, introduce yourself
              any time.
            </p>
            {mailto && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="xl" render={<a href={mailto} />} nativeButton={false}>
                  <Mail aria-hidden="true" />
                  Email your introduction
                </Button>
                {siteConfig.phone.tel && (
                  <a
                    href={`tel:${siteConfig.phone.tel}`}
                    className="inline-flex items-center gap-2 text-base font-semibold text-navy-900 underline-offset-4 hover:underline"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {siteConfig.phone.display}
                  </a>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Who we hire */}
      <Section>
        <SectionHeading
          eyebrow="Who we look for"
          title="The roles that keep our roofs standing"
          description="Openings vary with the season and the workload, but these are the people we're always glad to meet."
        />
        <StaggerGroup className="mt-12 grid gap-5 lg:grid-cols-3">
          {roles.map((role) => (
            <StaggerItem
              key={role.title}
              className="shadow-premium h-full rounded-2xl border border-border bg-white p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900">
                <role.icon className="size-6 text-white" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-900">
                {role.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-slate-600">
                {role.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* What we expect */}
      <Section tone="navy">
        <SectionHeading
          eyebrow="The standard"
          title="What working here means"
          onDark
        />
        <StaggerGroup as="ul" className="mt-12 grid gap-4 lg:grid-cols-3">
          {expectations.map((item) => (
            <StaggerItem
              as="li"
              key={item.title}
              className="h-full rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <item.icon className="size-6 text-steel-300" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-300">
                {item.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* How to apply */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-steel-500 uppercase">
              How to apply
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              No forms, no portals — just reach out
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Send a short email telling us who you are, what you&apos;ve
              built, and what kind of role you&apos;re after — a résumé helps
              but photos of your work say more. Or call the office and ask for
              a conversation. We respond to every serious introduction.
            </p>
            {mailto && (
              <div className="mt-8">
                <Button size="xl" render={<a href={mailto} />} nativeButton={false}>
                  <Mail aria-hidden="true" />
                  {siteConfig.email}
                </Button>
              </div>
            )}
          </Reveal>
        </div>
      </Section>
    </>
  );
}
