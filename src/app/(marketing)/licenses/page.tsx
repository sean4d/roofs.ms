import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { LicensePanel } from "@/components/shared/license-panel";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * Licensing and credentials.
 *
 * WHY THIS PAGE EXISTS. Southeast Roofing holds two Mississippi licences from
 * two different registers, plus manufacturer and bureau credentials, and until
 * now they were scattered across a footer line, a homepage badge and a
 * sentence on About. Nowhere could a property manager, an insurance adjuster,
 * a search engine or an answer engine see the whole set at once with a way to
 * check each one.
 *
 * It is a trust page, not a keyword page. Everything on it is a fact somebody
 * else can confirm: two state licence numbers with links to the board's own
 * records, the GAF and BBB profiles, and the registered address. Nothing here
 * is a claim we made up about ourselves, which is exactly why it is worth
 * having as a page rather than a paragraph.
 */

export const metadata: Metadata = buildMetadata({
  title: "Licenses & Credentials | Southeast Roofing, Hattiesburg MS",
  description:
    "Southeast Roofing LLC holds MSBOC Residential License R22245 and Commercial Certificate of Responsibility 27720-SC. Verify both with the Mississippi State Board of Contractors.",
  path: "/licenses",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Licenses & Credentials", path: "/licenses" },
];

/**
 * Real questions, answered plainly. FAQPage schema is only legitimate when the
 * answers are genuinely on the page, so every one of these renders visibly.
 */
const faqs = [
  {
    question:
      "Is Southeast Roofing licensed for commercial roofing in Mississippi?",
    answer: `Yes. ${siteConfig.legalName} holds Mississippi State Board of Contractors Commercial Certificate of Responsibility ${siteConfig.licenseCommercial}, which is the credential Mississippi requires for commercial construction work. You can check it directly on the board's public record.`,
  },
  {
    question: "Is Southeast Roofing licensed for residential roofing?",
    answer: `Yes, and it always has been. MSBOC Residential License ${siteConfig.license} covers houses and other residential property across Mississippi. Adding the commercial certificate did not change anything about the residential side of the business.`,
  },
  {
    question: "How do I verify a Mississippi roofing contractor's license?",
    answer:
      "Search the Mississippi State Board of Contractors register at search.msboc.us. Commercial certificates and residential licenses sit in two separate indexes, so a contractor can appear in one and not the other. Ask which one they hold for the work you are having done, and check that index.",
  },
  {
    question: "Why does the license number matter for commercial work?",
    answer:
      "Because commercial roofing in Mississippi is not open to anyone with a ladder. A certificate of responsibility requires trade and business examinations, a reviewed or audited financial statement, and proof of insurance filed with the state. Plenty of crews that appear after a storm hold none of it.",
  },
  {
    question: "Is Southeast Roofing insured?",
    answer:
      "Yes. We carry general liability and workers' compensation coverage, and we are happy to have a certificate of insurance sent directly to a property manager or homeowner from our agent before work starts.",
  },
];

const otherCredentials = [
  {
    name: "GAF Certified Contractor",
    detail:
      "Factory certification from our primary shingle manufacturer, which is what lets us register the manufacturer warranties on the roofs we install.",
    href: siteConfig.links.gafProfile,
    cta: "Verify on gaf.com",
  },
  {
    name: "BBB Accredited, A+ rating",
    detail:
      "Accredited with the Better Business Bureau, with the complaint and resolution history that goes with it publicly visible.",
    href: siteConfig.links.bbbProfile,
    cta: "Verify on bbb.org",
  },
];

export default function LicensesPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs)]} />

      <Section className="pt-10 pb-4">
        <Breadcrumbs items={breadcrumbs} />
      </Section>

      <Section className="pt-6 pb-16">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide text-steel-500 uppercase">
            Credentials
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight font-extrabold text-navy-900 sm:text-5xl">
            Licenses &amp; credentials for {siteConfig.legalName}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            {siteConfig.descriptor}, based at {siteConfig.address.streetAddress}{" "}
            in {siteConfig.address.addressLocality},{" "}
            {siteConfig.address.addressRegion} {siteConfig.address.postalCode}.
            Mississippi licenses residential and commercial contracting
            separately, and we hold both. Every number on this page links to the
            record that proves it.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <LicensePanel heading="Our two Mississippi State Board of Contractors licenses" />
        </Reveal>

        <Reveal className="mt-12">
          <SectionHeading
            eyebrow="What each one covers"
            title="Two licenses, two kinds of building"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="shadow-premium rounded-2xl border border-border bg-white p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                Residential roofing
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Roof replacement, roof repair, storm and hail damage,
                architectural shingles, metal roofing, gutters, siding and
                fascia work on houses across the Pine Belt and the Gulf Coast.
                This is the work the company was built on and it has not slowed
                down.
              </p>
              <Link
                href="/residential"
                className="mt-4 inline-block text-sm font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
              >
                Residential roofing services
              </Link>
            </div>
            <div className="shadow-premium rounded-2xl border border-border bg-white p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                Commercial roofing
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Flat and low-slope systems on offices, retail, warehouses,
                churches, apartments and light industrial buildings: TPO, PVC,
                EPDM, modified bitumen, standing seam metal, silicone roof
                coatings, leak investigation and maintenance programs.
              </p>
              <Link
                href="/commercial"
                className="mt-4 inline-block text-sm font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
              >
                Commercial roofing services
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <SectionHeading
            eyebrow="Beyond the state"
            title="Manufacturer and bureau credentials"
          />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {otherCredentials.map((credential) => (
              <li
                key={credential.name}
                className="shadow-premium rounded-2xl border border-border bg-white p-6"
              >
                <h3 className="font-display text-lg font-bold text-navy-900">
                  {credential.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {credential.detail}
                </p>
                <a
                  href={credential.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
                >
                  {credential.cta}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <SectionHeading
            eyebrow="Common questions"
            title="Checking a Mississippi roofing contractor"
          />
          <dl className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="shadow-premium rounded-2xl border border-border bg-white p-6"
              >
                <dt className="font-display text-lg font-bold text-navy-900">
                  {faq.question}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12 rounded-2xl bg-navy-900 p-8 text-white sm:p-10">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-1 size-7 shrink-0 text-steel-300"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-display text-2xl font-bold">
                Checking us out before you call?
              </h2>
              <p className="text-steel-200 mt-3 max-w-2xl leading-relaxed">
                Good. That is the right instinct with any contractor, and
                everything you need is above. When you are ready, the inspection
                is free and there is no obligation attached to it.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button
                  size="xl"
                  render={<Link href="/free-inspection" />}
                  nativeButton={false}
                >
                  Book a free inspection
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  render={<Link href="/commercial/request-consultation" />}
                  nativeButton={false}
                >
                  Commercial consultation
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
