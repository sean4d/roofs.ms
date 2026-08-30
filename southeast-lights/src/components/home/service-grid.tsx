import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { enabledServices, serviceCardImage } from "@/config/services";
import type { SeasonMode } from "@/config/season";

/**
 * Services, ordered by season.
 *
 * Nothing is hidden either way, so every page stays permanently crawlable:
 * only the ORDER changes.
 *
 * Alignment: a fixed 3:2 media block tops every cell and `mt-auto` pins every
 * link to the same baseline, so cards line up regardless of how long a summary
 * runs.
 */
export function ServiceGrid({ mode }: { mode: SeasonMode }) {
  const services = [...enabledServices()].sort((a, b) => {
    const weight = (division: string) =>
      mode === "holiday"
        ? division === "holiday"
          ? 0
          : 1
        : division === "holiday"
          ? 1
          : 0;
    return weight(a.division) - weight(b.division);
  });

  return (
    <section className="band">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-champagne-500">What we install</p>
            <h2 className="mt-5 text-3xl font-semibold text-balance sm:text-4xl">
              {mode === "holiday"
                ? "Christmas is the busy season. It is not the whole business."
                : "Lighting for the other eleven months."}
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-champagne-300 hover:text-champagne-200"
          >
            All services
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group cell overflow-hidden rounded-card border border-white/[0.09] transition-colors hover:border-champagne-400/40"
            >
              <div className="cell-media">
                <Image
                  src={serviceCardImage(service).src}
                  alt={serviceCardImage(service).alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={serviceCardImage(service).blurDataURL}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold">{service.label}</h3>
                <p className="text-bone-400 mt-2.5 text-sm leading-relaxed">
                  {service.summary}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-medium text-champagne-300">
                  Learn more
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
