import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { homeFaqs } from "@/content/homepage";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, webSiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { DivisionSplit } from "@/components/home/division-split";
import { ServicesOverview } from "@/components/home/services-overview";
import { StormInsurance } from "@/components/home/storm-insurance";
import { RoofingSystems } from "@/components/home/roofing-systems";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { ManufacturerStrip } from "@/components/home/manufacturer-strip";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { WhyUs } from "@/components/home/why-us";
import { FinancingStrip } from "@/components/home/financing-strip";
import { ServiceArea } from "@/components/home/service-area";
import { ReviewsTrust } from "@/components/home/reviews-trust";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Roofing Contractor in Hattiesburg, MS`,
  description:
    "Premium residential and commercial roofing across South Mississippi. Roof replacement, repair, metal roofing systems, storm damage response, and insurance claim help — based in Hattiesburg, MS.",
  path: "/",
});

/** Homepage (PRD §3) — 13 sections, light navy premium design system. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={[webSiteSchema(), faqSchema(homeFaqs)]} />
      <Hero />
      <TrustBar />
      <DivisionSplit />
      <ServicesOverview />
      <ProcessTimeline />
      <StormInsurance />
      <RoofingSystems />
      <ManufacturerStrip />
      <FeaturedProjects />
      <WhyUs />
      <FinancingStrip />
      <ServiceArea />
      <ReviewsTrust />
      <FaqSection />
      <FinalCta />
    </>
  );
}
