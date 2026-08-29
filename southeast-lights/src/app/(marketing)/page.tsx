import { AllInclusive } from "@/components/home/all-inclusive";
import { CommercialBand } from "@/components/home/commercial-band";
import { EstimatorTeaser } from "@/components/home/estimator-teaser";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { ReviewsBand } from "@/components/home/reviews-band";
import { RoofAdvantage } from "@/components/home/roof-advantage";
import { SegmentPicker } from "@/components/home/segment-picker";
import { ServiceAreasBand } from "@/components/home/service-areas-band";
import { ServiceGrid } from "@/components/home/service-grid";
import { TrustStrip } from "@/components/home/trust-strip";
import { resolveSeasonMode } from "@/config/season";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  // The root layout appends "| Southeast Lights" to every title, so this one
  // carries only the descriptive half.
  title: "Christmas & Permanent Lighting in Hattiesburg, MS",
  description:
    "Professional Christmas light installation and permanent architectural lighting across South Mississippi. All-inclusive service: design, installation, maintenance, takedown and storage. Installed by a licensed roofing contractor.",
  path: "/",
});

/**
 * Season-aware, so it must not be frozen at build time: a site built in July
 * would still be in off-season mode in December. An hour of revalidation
 * keeps it cheap while guaranteeing the switch lands within the hour.
 */
export const revalidate = 3600;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const now = new Date();
  // ?season=holiday / ?season=offseason previews either personality.
  // Honoured outside production only, so there is no public toggle.
  const mode = resolveSeasonMode((await searchParams).season, now);

  return (
    <>
      <Hero mode={mode} now={now} />
      <TrustStrip />
      <SegmentPicker />
      <EstimatorTeaser />
      <CommercialBand />
      <AllInclusive />
      <RoofAdvantage />
      <ReviewsBand />
      <FeaturedProjects />
      <Process />
      <ServiceGrid mode={mode} />
      <ServiceAreasBand />
      <FinalCta mode={mode} now={now} />
    </>
  );
}
