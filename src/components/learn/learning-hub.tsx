"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Search } from "lucide-react";
import { track } from "@vercel/analytics";

import { cn } from "@/lib/utils";

export interface HubArticle {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  path: string;
  thumb?: string;
  /** City/town of the real job photo used as the thumbnail (location tag). */
  thumbCity?: string;
}

export interface HubCategory {
  slug: string;
  label: string;
}

/**
 * Interactive Learning Center: filter by category, search by keyword, and
 * browse visual cards. Data comes from the real learn articles — the hub only
 * changes how they're found, never invents content.
 */
export function LearningHub({
  articles,
  categories,
}: {
  articles: HubArticle[];
  categories: HubCategory[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (!active || a.category === active) &&
        (!q ||
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.categoryLabel.toLowerCase().includes(q)),
    );
  }, [articles, active, query]);

  const countFor = (slug: string | null) =>
    slug ? articles.filter((a) => a.category === slug).length : articles.length;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides…"
          className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-4 text-navy-900 outline-none focus:border-steel-500"
        />
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={active === null} onClick={() => setActive(null)}>
          All ({countFor(null)})
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            active={active === c.slug}
            onClick={() => {
              setActive(c.slug);
              track("learn_filter", { category: c.slug });
            }}
          >
            {c.label} ({countFor(c.slug)})
          </FilterChip>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border bg-secondary/50 p-8 text-center text-slate-500">
          No guides match that yet. Try another search or{" "}
          <Link href="/contact" className="font-semibold text-navy-900 underline underline-offset-4">
            ask us directly
          </Link>
          .
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <li key={a.slug} className="h-full">
              <Link
                href={a.path}
                onClick={() => track("learn_card_click", { slug: a.slug })}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                  {a.thumb ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.thumb}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {a.thumbCity && (
                        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy-950/70 px-2 py-0.5 text-xs font-semibold text-white">
                          <MapPin className="size-3" aria-hidden="true" />
                          {a.thumbCity}
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 p-4 text-center">
                      <span className="font-display text-lg font-bold text-white/90">
                        {a.categoryLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 font-semibold text-navy-900">
                      {a.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5 text-steel-500" aria-hidden="true" />
                      {a.readMinutes} min
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-navy-900">
                    {a.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {a.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                    Read the guide
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
        active
          ? "border-navy-900 bg-navy-900 text-white"
          : "border-border bg-white text-slate-600 hover:border-steel-500 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}
