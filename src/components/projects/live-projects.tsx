"use client";

import { useMemo, useState } from "react";

import { urlFor } from "@/sanity/lib/image";
import type { LiveProject } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";

/**
 * Live gallery feed, powered by jobs submitted at /upload. Filter chips are
 * built dynamically from the tags each job generates (job type, brand, color,
 * city, storm-damage type, plus keywords pulled from the description) — so the
 * gallery's filters grow on their own as jobs are posted. Renders nothing when
 * there are no jobs yet, leaving the curated static gallery untouched.
 */
export function LiveProjects({ projects }: { projects: LiveProject[] }) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [projects]);

  const shown = active
    ? projects.filter((p) => (p.tags ?? []).includes(active))
    : projects;

  if (projects.length === 0) return null;

  return (
    <section className="border-b border-border bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-steel-500">
            Latest jobs
          </p>
          <h2 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">
            Fresh from the field
          </h2>
        </div>

        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <FilterPill active={active === null} onClick={() => setActive(null)}>
              All
            </FilterPill>
            {tags.map((tag) => (
              <FilterPill
                key={tag}
                active={active === tag}
                onClick={() => setActive(active === tag ? null : tag)}
              >
                {tag}
              </FilterPill>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function cover(project: LiveProject) {
  const media = project.media ?? [];
  return media.find((m) => m.phase === "after") ?? media.find((m) => m.ref) ?? null;
}

function ProjectCard({ project }: { project: LiveProject }) {
  const photo = cover(project);
  const src = photo?.ref
    ? urlFor({ _type: "image", asset: { _ref: photo.ref } })
        .width(800)
        .height(600)
        .fit("crop")
        .url()
    : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="aspect-[4/3] bg-secondary">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={photo?.alt ?? project.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-navy-900">{project.title}</h3>
        {project.summary && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{project.summary}</p>
        )}
      </div>
    </article>
  );
}

function FilterPill({
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
        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200",
        active
          ? "border-navy-900 bg-navy-900 text-white shadow-md"
          : "border-border bg-white text-slate-600 hover:border-steel-500 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}
