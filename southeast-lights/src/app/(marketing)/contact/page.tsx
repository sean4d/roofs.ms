import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ResidentialQuoteForm } from "@/components/forms/residential-quote-form";
import {
  CallLink,
  EmailLink,
  TextLink,
} from "@/components/shared/contact-actions";
import { JsonLd } from "@/components/seo/json-ld";
import { COVERAGE } from "@/config/service-areas";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Southeast Lights | Hattiesburg, MS",
  description:
    "Call, text or email Southeast Lights in Hattiesburg, Mississippi. Holiday, permanent, landscape and event lighting across South Mississippi and the Gulf Coast.",
  path: "/contact",
});

export default function ContactPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  const { address } = siteConfig;

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="relative isolate overflow-hidden pt-32 pb-8">
        <div className="glow-top absolute inset-x-0 top-0 -z-10 h-52" />
        <div className="container-site">
          <p className="eyebrow text-champagne-400">Contact</p>
          <h1 className="mt-4 max-w-2xl text-[2.2rem] leading-[1.08] font-semibold text-balance sm:text-5xl">
            Get in touch.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-300">
            Text is usually fastest. Send a photo of the property with it and we
            can often tell you a ballpark on the spot.
          </p>
        </div>
      </section>
      <Breadcrumbs trail={trail} />

      <div className="container-site grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <ResidentialQuoteForm />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card-lit flex flex-col gap-4 p-6">
            <h2 className="text-lg font-semibold">Direct</h2>
            <CallLink className="text-bone-300 transition-colors hover:text-champagne-300" />
            <TextLink className="text-bone-300 transition-colors hover:text-champagne-300" />
            <EmailLink className="text-bone-300 transition-colors hover:text-champagne-300" />
            {address.streetAddress ? (
              <address className="mt-2 text-sm leading-relaxed text-bone-500 not-italic">
                {address.streetAddress}
                <br />
                {address.addressLocality}, {address.addressRegion}{" "}
                {address.postalCode}
              </address>
            ) : null}

            {/* Hours are one of the first things a caller checks, and until
                now they were nowhere on the site. */}
            <div className="mt-2 border-t border-white/10 pt-4">
              <p className="text-bone-200 text-sm font-medium">
                {siteConfig.hours.display}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-bone-500">
                {siteConfig.hours.note}
              </p>
            </div>
          </div>

          <div className="card-lit p-6">
            <h2 className="text-lg font-semibold">Coverage</h2>
            <p className="text-bone-400 mt-3 text-sm leading-relaxed">
              {COVERAGE.residential}
            </p>
            <p className="text-bone-400 mt-3 text-sm leading-relaxed">
              {COVERAGE.commercial}
            </p>
          </div>

          <div className="card-lit p-6">
            <h2 className="text-lg font-semibold">Payment</h2>
            <ul className="text-bone-400 mt-3 flex flex-col gap-2 text-sm">
              <li>{siteConfig.payment.accepted.join(", ")}</li>
              <li>{siteConfig.payment.deposit}</li>
              <li>{siteConfig.payment.balance}</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
