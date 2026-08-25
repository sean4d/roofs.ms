import Link from "next/link";

import { ResidentialQuoteForm } from "@/components/forms/residential-quote-form";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { HOLIDAY } from "@/config/pricing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { formatUsd } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Get a Lighting Quote | Southeast Lights",
  description:
    "Request a quote for holiday, permanent or landscape lighting in South Mississippi. Most quotes need only your address and a short conversation.",
  path: "/quote",
});

export default function QuotePage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Get a Quote", path: "/quote" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="relative isolate overflow-hidden pt-32 pb-8">
        <div className="glow-top absolute inset-x-0 top-0 -z-10 h-52" />
        <div className="container-site">
          <p className="eyebrow text-champagne-400">Residential</p>
          <h1 className="mt-4 max-w-2xl text-[2.2rem] leading-[1.08] font-semibold text-balance sm:text-5xl">
            Get a quote.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-300">
            Tell us about the property and what you have in mind. Most
            residential quotes never need a site visit, because we measure from
            the address and aerial imagery.
          </p>
        </div>
      </section>
      <Breadcrumbs trail={trail} />

      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <ResidentialQuoteForm />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card-lit p-6">
            <h2 className="text-lg font-semibold">What to expect</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-bone-400">
              <li>We review the property from your address and aerial imagery.</li>
              <li>You get a design and one fixed price for the whole season.</li>
              <li>
                Residential displays begin at {formatUsd(HOLIDAY.minimum)}. Most
                custom projects land between $1,500 and $5,000.
              </li>
              <li>No obligation, and no pressure if the numbers do not work.</li>
            </ul>
          </div>

          <div className="card-lit p-6">
            <h2 className="text-lg font-semibold">Running a commercial property?</h2>
            <p className="mt-3 text-sm leading-relaxed text-bone-400">
              HOAs, churches, municipalities, hotels and retail properties get a
              different process, with a written scope and a design concept for
              your board.
            </p>
            <Link
              href="/commercial/request-proposal"
              className="mt-4 inline-flex text-sm font-medium text-champagne-300 hover:text-champagne-200"
            >
              Request a commercial proposal
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
