import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { divisionSplit } from "@/content/homepage";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

interface PanelProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  photo: { src: string; alt: string };
  highlights: readonly string[];
  chips?: readonly {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];
}

function DivisionPanel({
  title,
  description,
  href,
  cta,
  photo,
  highlights,
  chips,
}: PanelProps) {
  return (
    <Link
      href={href}
      className="group shadow-premium relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl border border-border"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        quality={70}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {/* Navy gradient for text legibility over the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/35 to-transparent"
      />
      <div className="relative p-8 text-white sm:p-10">
        {chips && (
          <ul
            className="mb-6 flex flex-wrap gap-2"
            aria-label="Industries served"
          >
            {chips.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy-950/40 px-3 py-1 text-xs font-medium text-steel-100 backdrop-blur-sm"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        )}
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-steel-100 sm:text-base">
          {description}
        </p>
        <ul className="mt-5 space-y-1.5 text-sm text-steel-100">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="size-4 text-steel-300" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
          {cta}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

/**
 * Residential / Commercial split (PRD §3.3). Owner rebalance 2026-07-04:
 * the two divisions are presented evenly: equal panels, both photo-led
 * (residential home + commercial aerial, both licensed stock per the
 * homepage imagery policy).
 */
export function DivisionSplit() {
  const { residential, commercial } = divisionSplit;

  return (
    <section
      aria-label="Our two divisions"
      className="bg-secondary py-20 sm:py-24 lg:py-28"
    >
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {divisionSplit.heading}
          </h2>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-2">
          <StaggerItem>
            <DivisionPanel {...residential} />
          </StaggerItem>
          <StaggerItem>
            <DivisionPanel {...commercial} chips={commercial.industries} />
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
