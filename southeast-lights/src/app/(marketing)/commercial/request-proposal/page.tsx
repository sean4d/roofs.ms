import { CommercialProposalForm } from "@/components/forms/commercial-proposal-form";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { COVERAGE } from "@/config/service-areas";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Commercial Lighting Proposal",
  description:
    "Request a commercial or HOA lighting design and proposal. Written scope, design concept, proof of insurance and a fixed seasonal price for properties across Mississippi.",
  path: "/commercial/request-proposal",
});

export default function RequestProposalPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Commercial", path: "/commercial" },
    { name: "Request a Proposal", path: "/commercial/request-proposal" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="relative isolate overflow-hidden pt-32 pb-8">
        <div className="glow-top absolute inset-x-0 top-0 -z-10 h-52" />
        <div className="container-site">
          <p className="eyebrow text-champagne-400">Commercial &amp; HOA</p>
          <h1 className="mt-4 max-w-3xl text-[2.2rem] leading-[1.08] font-semibold text-balance sm:text-5xl">
            Request a design and proposal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-300">
            Attach what you have and we will do the measuring. You get a scope,
            a visual concept you can put in front of a board, insurance
            documentation, and a price for the season.
          </p>
        </div>
      </section>
      <Breadcrumbs trail={trail} />

      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <CommercialProposalForm />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card-lit p-6">
            <h2 className="text-lg font-semibold">What you get back</h2>
            <ul className="text-bone-400 mt-4 flex flex-col gap-3 text-sm leading-relaxed">
              <li>A written scope stating exactly what is included.</li>
              <li>A visual design concept for the property.</li>
              <li>Certificates of insurance, W-9 and references on request.</li>
              <li>One fixed price for the season, not an hourly estimate.</li>
            </ul>
          </div>

          <div className="card-lit p-6">
            <h2 className="text-lg font-semibold">How far we travel</h2>
            <p className="text-bone-400 mt-3 text-sm leading-relaxed">
              {COVERAGE.commercial}
            </p>
            <p className="text-bone-400 mt-3 text-sm leading-relaxed">
              {COVERAGE.large}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
