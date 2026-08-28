import { ShieldCheck, Star } from "lucide-react";

import type { LeadRequest } from "@/config/lead-requests";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/motion/reveal";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * Renders a lead-capture page for one request type (see config/lead-requests).
 * Every request kind: inspection, itemized estimate, storm inspection, repair:
 * shares this layout so the site feels consistent, while the headline, form
 * labels, and confirmation copy all match the button the visitor clicked.
 */
export function RequestPage({ request }: { request: LeadRequest }) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: request.label, path: request.path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="bg-secondary">
        <div className="container-site grid gap-12 py-14 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              {request.h1}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              {request.intro}
            </p>

            <ul className="mt-10 space-y-6">
              {request.points.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                    <item.icon
                      className="size-5 text-steel-500"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h2 className="font-display font-semibold">{item.title}</h2>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Star className="size-4 text-steel-500" aria-hidden="true" />
                5-star Google rating
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  className="size-4 text-steel-500"
                  aria-hidden="true"
                />
                GAF Certified · MS License #R22245
              </span>
            </div>
            <p className="mt-6 text-sm text-slate-600">
              Rather talk to a person right now?{" "}
              <PhoneLink className="text-navy-900" />
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <LeadForm
              variant="short"
              source={request.source}
              submitLabel={request.submitLabel}
              successTitle={request.successTitle}
              successBody={request.successBody}
              defaultService={request.defaultService}
              defaultStorm={request.defaultStorm}
              showBooking={request.showBooking}
              choice={request.choice}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
