import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { enabledServices } from "@/config/services";
import type { SeasonMode } from "@/config/season";

/**
 * Services, ordered by season.
 *
 * In holiday mode the Christmas services lead. Off-season the permanent,
 * landscape and event services come first, since that is what someone is
 * searching for in April. Nothing is hidden either way, which keeps every
 * page permanently crawlable: only the ORDER changes.
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
    <section className="py-20 lg:py-24">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-champagne-500">What we install</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
              {mode === "holiday"
                ? "Holiday lighting is the season. It is not the whole business."
                : "Lighting that works the other eleven months."}
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
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
      </div>
    </section>
  );
}
