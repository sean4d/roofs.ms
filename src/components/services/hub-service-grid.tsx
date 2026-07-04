import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { HubServiceCard } from "@/content/hubs";
import { serviceImageFor } from "@/content/service-images";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Service-card grid used by hub pages (visual-first directive 2026-07-04):
 * when the image registry has honest photography for a route, the card
 * renders as a photo card — image-led with a navy gradient for text
 * legibility. Otherwise it falls back to the clean icon treatment. Swapping
 * a card to photo = one entry in content/service-images.ts.
 */
export function HubServiceGrid({ services }: { services: HubServiceCard[] }) {
  return (
    <StaggerGroup
      as="ul"
      className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((service) => {
        const image = serviceImageFor(service.href);

        return (
          <StaggerItem as="li" key={service.href}>
            {image ? (
              <Link
                href={service.href}
                className="group relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/5"
                />
                <div className="relative p-6">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {service.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel-100">
                    {service.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Learn more
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href={service.href}
                className="group flex h-full min-h-64 flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
              >
                <service.icon
                  className="size-7 text-steel-500 transition-colors group-hover:text-navy-900"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {service.label}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                  Learn more
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            )}
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}
