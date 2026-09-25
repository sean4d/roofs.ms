import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { MSBOC } from "@/config/licensing";
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
    answer: `Yes. ${siteConfig.legalName} holds ${MSBOC.name} ${MSBOC.commercialCredential} ${siteConfig.licenseCommercial}, and you can check it directly on the board's public record. On the law itself, MSBOC states: "${MSBOC.commercialThreshold}" Work below that figure may still be subject to city or county requirements, which MSBOC does not administer.`,
  },
  {
    question: "Is Southeast Roofing licensed for residential roofing?",
    answer: `Yes, and it always has been. MSBOC Residential License ${siteConfig.license} covers houses and other residential property across Mississippi, and adding the commercial certificate changed nothing about that side of the business. MSBOC states: "${MSBOC.residentialThreshold}" A roof replacement is almost always over that ${MSBOC.residentialRoofingThreshold} roofing figure.`,
  },
  {
    question: "How do I verify a Mississippi roofing contractor's license?",
    answer:
      "Search the Mississippi State Board of Contractors register at search.msboc.us. Commercial certificates and residential licenses sit in two separate indexes, so a contractor can appear in one and not the other. Ask which one they hold for the work you are having done, and check that index. Our step-by-step guide walks through the whole check, including the thresholds that decide which credential applies.",
  },
  {
    question: "Why does the license number matter for commercial work?",
    /*
     * WAS a list of what a certificate "requires": trade and business
     * examinations, a reviewed or audited financial statement, insurance
     * filed with the state. Those are things WE did. Stating them as the
     * general rule was writing the board's requirements from memory in order
     * to make competitors sound unqualified, which is both inaccurate and a
     * poor look. What is left is checkable and still the point.
     */
    answer: `Because a licence number is the one claim on a roofing website you can check against somebody other than the roofer. Ours is ${siteConfig.licenseCommercial} and it is in the board's commercial register. If a contractor bidding your building cannot give you a number that resolves there, that is worth knowing before you sign, particularly on a job over ${MSBOC.commercialJobThreshold} where MSBOC requires a commercial licence.`,
  },
  {
    question: "Is Southeast Roofing insured and bonded?",
    answer:
      "Yes to both. We carry general liability and workers' compensation coverage and we are bonded, and we are happy to have a certificate of insurance sent directly to a property manager or homeowner from our agent before work starts.",
  },
  /*
   * MANUFACTURER QUESTIONS, ADDED 2026-09-24.
   *
   * These are here because they are the questions an answer engine gets asked
   * about a roofer ("is X a CertainTeed ShingleMaster", "what shingles does X
   * install") and because the credential-versus-product distinction is easy
   * to get wrong. Answering it plainly, in visible copy on the page that also
   * emits the FAQ schema, is the clearest way to put the right version of the
   * fact where both a person and a machine will find it.
   */
  {
    question: "Is Southeast Roofing a CertainTeed ShingleMaster?",
    answer: `Yes. ${siteConfig.legalName} holds CertainTeed's ShingleMaster credential, and CertainTeed publishes our profile on their own site so you can check it rather than take our word for it. We also hold GAF Certified Contractor status. The two are separate credentials from separate manufacturers and we hold both.`,
  },
  {
    question:
      "Which shingle brands does Southeast Roofing install: CertainTeed, GAF or Owens Corning?",
    answer:
      "All three. There is a distinction worth understanding, though: GAF and CertainTeed have each certified us, which is why those two carry verifiable credentials. Owens Corning is a product line we install when its style, colour or availability suits the roof best. We install their shingles; they have not certified us, and we do not claim otherwise.",
  },
];

/**
 * Everything that is not a state licence, each with the record that proves it.
 *
 * CertainTeed ShingleMaster and the Area Development Partnership membership
 * were added 2026-09-24. Owens Corning is deliberately not in this list: we
 * install their shingles and they have not certified us, so it is not a
 * credential and it does not belong on a credentials page.
 */
const otherCredentials = [
  {
    name: "GAF Certified Contractor",
    detail:
      "Certified by GAF, which is what lets us register GAF's manufacturer warranties on the roofs we install.",
    href: siteConfig.links.gafProfile,
    cta: "Verify on gaf.com",
  },
  {
    name: "CertainTeed ShingleMaster",
    detail:
      "CertainTeed's certification for shingle installers, earned against their training and installation standards. We hold it alongside our GAF certification, so both manufacturers have certified our crews.",
    href: siteConfig.links.certainteedProfile,
    cta: "Verify on certainteed.com",
  },
  {
    name: "BBB Accredited, A+ rating",
    detail:
      "Accredited with the Better Business Bureau, with the complaint and resolution history that goes with it publicly visible.",
    href: siteConfig.links.bbbProfile,
    cta: "Verify on bbb.org",
  },
  {
    name: "Area Development Partnership member",
    detail:
      "Member of the Area Development Partnership, the chamber of commerce for Greater Hattiesburg. This is a business membership, not a roofing certification.",
    href: siteConfig.links.adpMember,
    cta: "Verify on theadp.com",
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
                churches, apartments and industrial buildings: TPO, PVC, EPDM,
                modified bitumen, standing seam metal, silicone roof coatings,
                leak investigation and maintenance programs.
              </p>
              <Link
                href="/commercial"
                className="mt-4 inline-block text-sm font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
              >
                Commercial roofing services
              </Link>
            </div>
          </div>
          {/* The how-to lives in the Learning Center, where somebody checking a
              different contractor will actually find it. This page is the
              proof; that article is the method. */}
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Checking a roofer other than us?{" "}
            <Link
              href="/learn/hiring/verify-mississippi-commercial-roofing-license"
              className="font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
            >
              How to verify a Mississippi commercial roofing contractor&apos;s
              license
            </Link>{" "}
            walks through the register, the two indexes, and the thresholds that
            decide which credential applies.
          </p>
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
