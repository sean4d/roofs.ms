import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { HubServiceCard } from "@/content/hubs";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/** Icon service-card grid used by hub pages. */
export function HubServiceGrid({ services }: { services: HubServiceCard[] }) {
  return (
    <StaggerGroup
      as="ul"
      className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((service) => (
        <StaggerItem as="li" key={service.href}>
          <Link
            href={service.href}
            className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-lg"
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
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
