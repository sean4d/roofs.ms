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
import { DigitalProposal } from "@/components/home/digital-proposal";
import { ManufacturerStrip } from "@/components/home/manufacturer-strip";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { WhyUs } from "@/components/home/why-us";
import { FinancingStrip } from "@/components/home/financing-strip";
import { ServiceArea } from "@/components/home/service-area";
import { ReviewsTrust } from "@/components/home/reviews-trust";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} | Licensed Roofing Contractor in Hattiesburg, MS`,
  description:
    "Southeast Roofing is a licensed Mississippi roofing contractor serving Hattiesburg and surrounding communities. Residential, commercial, metal roofing, storm damage, financing, and free inspections.",
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
      <DigitalProposal />
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
