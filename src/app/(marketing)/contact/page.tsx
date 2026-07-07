import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/shared/social-links";

/** Contact page (PRD §2 conversion) — full form + complete NAP. */

export const metadata: Metadata = buildMetadata({
  title: "Contact Southeast Roofing | Hattiesburg, MS",
  description:
    "Reach Southeast Roofing in Hattiesburg: call, email, or send the form and we'll get back to you fast. Serving all of South Mississippi.",
  path: "/contact",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  const { address } = siteConfig;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="bg-secondary">
        <div className="container-site grid gap-12 py-14 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Talk to a roofer, not a call center
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Call, email, or send the form — during business hours you&apos;ll
              usually hear back the same day.
            </p>

            <ul className="mt-10 space-y-5 text-navy-900">
              {siteConfig.phone.tel && (
                <li>
                  <a
                    href={`tel:${siteConfig.phone.tel}`}
                    className="inline-flex items-center gap-3 font-semibold transition-opacity hover:opacity-75"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-white">
                      <Phone
                        className="size-5 text-steel-500"
                        aria-hidden="true"
                      />
                    </span>
                    {siteConfig.phone.display}
                  </a>
                </li>
              )}
              {siteConfig.email && (
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center gap-3 font-semibold transition-opacity hover:opacity-75"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-white">
                      <Mail
                        className="size-5 text-steel-500"
                        aria-hidden="true"
                      />
                    </span>
                    {siteConfig.email}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                  <MapPin
                    className="size-5 text-steel-500"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-medium">
                  {address.streetAddress && (
                    <>
                      {address.streetAddress}
                      <br />
                    </>
                  )}
                  {address.addressLocality}, {address.addressRegion}{" "}
                  {address.postalCode}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                  <Clock className="size-5 text-steel-500" aria-hidden="true" />
                </span>
                <span className="font-medium">
                  {siteConfig.hours.display}
                  <span className="mt-0.5 block text-sm font-normal text-slate-500">
                    {siteConfig.hours.note}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-10">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Find us on
              </p>
              <SocialLinks className="mt-3 flex items-center gap-1 [&_a]:text-steel-500 [&_a:hover]:bg-secondary [&_a:hover]:text-navy-900" />
            </div>

            {/* Real storefront so visitors recognize the building */}
            <figure className="mt-10">
              <Image
                src="/images/office/southeast-roofing-office-exterior-hattiesburg-ms.webp"
                alt="Southeast Roofing's office storefront at 6668 US-98, Suite F in Hattiesburg, Mississippi."
                width={1200}
                height={1600}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="shadow-premium aspect-[4/3] w-full rounded-2xl border border-border object-cover"
              />
              <figcaption className="mt-2 text-sm text-slate-500">
                Look for the Southeast Roofing sign — Suite F, right on Highway 98.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <LeadForm variant="full" source="contact" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
