import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { IMAGES } from "@/config/images";
import { DIVISION_LABELS, enabledServices, type Division } from "@/config/services";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lighting Services | Southeast Lights",
  description:
    "Holiday, permanent architectural, landscape and event lighting across South Mississippi and the Gulf Coast. Professionally designed, installed and maintained.",
  path: "/services",
});

const ORDER: Division[] = ["holiday", "permanent", "landscape", "event"];

export default function ServicesPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ];
  const services = enabledServices();

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Services"
        title="Everything we light."
        intro="Holiday displays, permanent architectural lighting, landscape and accent lighting, and seasonal event work. All of it designed, installed and maintained by the same crews."
        image={IMAGES.estateWide}
        quoteLocation="services_hub"
      />
      <Breadcrumbs trail={trail} />

      {ORDER.map((division, index) => {
        const group = services.filter((s) => s.division === division);
        if (group.length === 0) return null;

        return (
          <Section
            key={division}
            tone={index % 2 === 1 ? "raised" : "ink"}
            eyebrow={DIVISION_LABELS[division]}
            title={
              division === "holiday"
                ? "The season everyone knows us for."
                : division === "permanent"
                  ? "Lighting that never comes down."
                  : division === "landscape"
                    ? "Lighting the grounds, not just the building."
                    : "Seasonal and event work."
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="card-lit group relative isolate flex min-h-[17rem] flex-col justify-end overflow-hidden p-6"
                >
                  <Image
                    src={service.image.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={service.image.blurDataURL}
                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="scrim-soft absolute inset-0 -z-10" />
                  <h3 className="text-lg font-semibold">{service.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone-300">
                    {service.summary}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-champagne-300">
                    Learn more
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        );
      })}

      <CtaBand
        title="Not sure which you need?"
        body="Tell us about the property and we will tell you honestly what is worth doing and what is not."
        location="services_hub_cta"
      />
    </>
  );
}
