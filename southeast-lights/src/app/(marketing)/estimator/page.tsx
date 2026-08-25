import { Estimator } from "@/components/estimator/estimator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { HOLIDAY } from "@/config/pricing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatUsd } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Christmas Light Estimator",
  description:
    "Build your holiday lighting display and see an estimated price. Choose rooflines, columns, windows, trees and pathways, pick a color scheme, and get a real range in about a minute.",
  path: "/estimator",
});

export default function EstimatorPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Estimator", path: "/estimator" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="relative isolate overflow-hidden pt-32 pb-10">
        <div className="glow-top absolute inset-x-0 top-0 -z-10 h-52" />
        <div className="container-site">
          <p className="eyebrow text-champagne-400">Design your display</p>
          <h1 className="mt-4 max-w-3xl text-[2.2rem] leading-[1.08] font-semibold text-balance sm:text-5xl">
            Light up your house and see the price.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-300">
            Turn on what you would like lit and the illustration shows you.
            Choose a color scheme, add trees, and get an estimated range. Then
            send us the exact design you built.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-bone-500">
            Professional residential displays begin at{" "}
            {formatUsd(HOLIDAY.minimum)}, and most custom projects land between
            $1,500 and $5,000. This tool will never quote you below the minimum.
          </p>
        </div>
      </section>
      <Breadcrumbs trail={trail} />

      <Estimator />

      <CtaBand
        title="Want it priced exactly?"
        body="Send us the design you just built along with your address. We measure from aerial imagery, so most quotes never need a site visit."
        location="estimator_cta"
      />
    </>
  );
}
