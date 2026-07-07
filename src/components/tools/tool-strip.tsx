import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { TOOLS, type ToolDef, type ToolKey } from "@/config/tools";

/**
 * Surfaces 1–3 relevant interactive tools contextually — used on service,
 * storm, city, and learn pages. Kept intentionally quiet (a small labelled
 * strip of cards, not a wall of CTAs) so it helps the visitor without
 * cluttering. Pick the tools that fit the page; don't force all of them.
 */
export function ToolStrip({
  tools,
  heading = "Helpful roofing tools",
}: {
  tools: ToolKey[];
  heading?: string;
}) {
  const items: ToolDef[] = tools.map((k) => TOOLS[k]).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section aria-label={heading} className="rounded-2xl border border-border bg-secondary/50 p-6 sm:p-7">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-steel-500">
        {heading}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tool) => {
          const Icon = tool.icon;
          const inner = (
            <>
              <span className="grid size-9 flex-none place-items-center rounded-full bg-navy-900/5 text-navy-900">
                <Icon className="size-4.5 text-steel-500" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-bold text-navy-900">
                  {tool.title}
                  {tool.external ? (
                    <ArrowUpRight className="size-3.5 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="size-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-600">
                  {tool.blurb}
                </span>
              </span>
            </>
          );
          const cls =
            "group flex items-start gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-sm";
          return tool.external ? (
            <a key={tool.key} href={tool.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={tool.key} href={tool.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
