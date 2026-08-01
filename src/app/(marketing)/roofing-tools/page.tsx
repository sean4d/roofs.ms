import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { TOOLS, type ToolDef } from "@/config/tools";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import type { JsonLdObject } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Roofing Tools hub (owner request 2026-07-24): one page listing every
 * interactive tool as a clickable card, linked from the main nav so people can
 * actually find them. Cards come straight from the TOOLS registry, one source
 * of truth, no drift.
 */

export const metadata: Metadata = buildMetadata({
  title: "Free Roofing Tools & Calculators | Southeast Roofing",
  description:
    "Free roofing tools from a Mississippi contractor: cost calculator, color visualizer, instant estimate, damage analyzer, insurance claim helper, and more.",
  path: "/roofing-tools",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Roofing Tools", path: "/roofing-tools" },
];

// Display order matches the nav + the owner's list: calc, visualizer, instant,
// analyzer, wizard, assistant, project map, anatomy.
const ORDER: ToolDef[] = [
  TOOLS["cost-calculator"],
  TOOLS["color-visualizer"],
  TOOLS["instant-estimate"],
  TOOLS["damage-analyzer"],
  TOOLS["insurance-wizard"],
  TOOLS["ai-assistant"],
  TOOLS["project-map"],
  TOOLS["roof-anatomy"],
];

const itemListSchema: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Southeast Roofing interactive tools",
  itemListElement: ORDER.map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.title,
    url: tool.external ? tool.href : absoluteUrl(tool.href),
  })),
};

export default function RoofingToolsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), itemListSchema]} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              Roofing tools, all in one place
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Ballpark a price, preview a color on a real roof, check storm
              damage, or walk through an insurance claim, free, no email
              required. Every tool we&apos;ve built, one tap away.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-site py-12 sm:py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((tool) => {
            const Icon = tool.icon;
            const inner = (
              <>
                <span className="grid size-12 flex-none place-items-center rounded-full bg-navy-900/5 text-navy-900">
                  <Icon className="size-6 text-steel-500" aria-hidden="true" />
                </span>
                <span className="mt-4 flex items-center gap-1.5 font-display text-lg font-bold text-navy-900">
                  {tool.title}
                  {tool.external ? (
                    <ArrowUpRight
                      className="size-4 text-slate-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowRight
                      className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-600">
                  {tool.blurb}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                  Open tool
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </>
            );
            const cls =
              "group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl";
            return (
              <li key={tool.key} className="h-full">
                {tool.external ? (
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={tool.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <FinalCta />
    </>
  );
}
