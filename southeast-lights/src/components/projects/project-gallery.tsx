"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/projects/project-card";
import { PROJECT_FILTERS, type Project } from "@/config/projects";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Filterable gallery. Filtering is client-side over a small, already-rendered
 * set, so it is instant and every project stays in the DOM for crawlers.
 */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");

  const available = useMemo(
    () =>
      PROJECT_FILTERS.filter(
        (option) =>
          option.key === "all" ||
          projects.some((project) => project.propertyType === option.key),
      ),
    [projects],
  );

  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.propertyType === filter);

  const hasDemo = visible.some((project) => project.isDemo);

  return (
    <div className="container-site py-14">
      <h2 className="sr-only">Project gallery</h2>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter projects"
      >
        {available.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={filter === option.key}
            onClick={() => {
              setFilter(option.key);
              track("gallery_interaction", { filter: option.key });
            }}
            className={cn(
              "rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
              filter === option.key
                ? "border-champagne-400/50 bg-champagne-400/10 text-champagne-200"
                : "text-bone-400 hover:text-bone-200 border-white/12",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {hasDemo ? (
        <p className="mt-6 rounded-lg border border-amber-300/30 bg-amber-300/[0.07] px-4 py-3 text-sm text-amber-100">
          <strong className="font-semibold">Development content.</strong>{" "}
          Projects marked as demo use placeholder photography and are not
          Southeast Lights installations. They are excluded from the production
          site and will be replaced with real project photography.
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-bone-500">No projects in this category yet.</p>
      ) : null}
    </div>
  );
}
