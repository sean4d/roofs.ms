import Link from "next/link";
import { ArrowUpRight, Sparkles, TreePine } from "lucide-react";

import { DIVISION_FLAGS } from "@/config/navigation";
import type { SeasonMode } from "@/config/season";

/**
 * The division grid. Only what we can actually deliver appears here — the
 * flags in navigation.ts are the single gate, so Landscape and Event cannot
 * leak onto the page before crews exist.
 *
 * Order flips with the season: whichever product someone is realistically
 * searching for goes first.
 */
const DIVISIONS = [
  {
    key: "holiday",
    href: "/holiday-lighting",
    icon: TreePine,
    title: "Holiday Lighting",
    blurb:
      "Custom-cut C9 on your rooflines, columns, windows and trees. Full service, every season, on a rental plan.",
    meta: "From $10 / ft",
    enabled: DIVISION_FLAGS.holiday,
  },
  {
    key: "permanent",
    href: "/permanent-lighting",
    icon: Sparkles,
    title: "Permanent Lighting",
    blurb:
      "Architectural LED hidden in your trim. Warm white nightly, full colour for every holiday, invisible by day.",
    meta: "From $25 / ft installed",
    enabled: DIVISION_FLAGS.permanent,
  },
] as const;

export function Divisions({ mode }: { mode: SeasonMode }) {
  const priority = mode === "holiday" ? "holiday" : "permanent";
  const ordered = [...DIVISIONS].sort((a, b) =>
    a.key === priority ? -1 : b.key === priority ? 1 : 0,
  );

  const live = ordered.filter((division) => division.enabled);

  return (
    <section className="surface-night py-24">
      <div className="container-site">
        <p className="font-display text-xs tracking-[0.18em] text-glow-500 uppercase">
          What we do
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold text-balance sm:text-4xl">
          Two ways to light a property, and we install both.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {live.map((division) => {
            const Icon = division.icon;
            return (
              <Link
                key={division.key}
                href={division.href}
                className="card-lit group flex flex-col gap-4 p-7"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-night-700 text-glow-500 transition-colors group-hover:bg-glow-500 group-hover:text-night-950">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="text-xl font-semibold">{division.title}</h3>
                <p className="text-steel-300">{division.blurb}</p>
                <p className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-glow-400">
                  {division.meta}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
