import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import type { Project } from "@/config/projects";

/**
 * A project card.
 *
 * Demo projects carry a visible badge. That badge is not decoration: the
 * gallery must never present placeholder photography as completed Southeast
 * Lights work, and a label the developer can see in every environment is
 * harder to forget than a rule written down somewhere.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-lit group relative isolate flex min-h-[20rem] flex-col justify-end overflow-hidden p-6"
    >
      <Image
        src={project.hero.src}
        alt={project.hero.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={project.hero.blurDataURL}
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="scrim-soft absolute inset-0 -z-10" />

      {project.isDemo ? (
        <span className="absolute top-4 left-4 rounded-md border border-amber-300/40 bg-amber-300/15 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-amber-200 uppercase backdrop-blur-sm">
          Demo content
        </span>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-champagne-300">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" strokeWidth={2} />
          {project.city}, MS
        </span>
        <span className="text-bone-500">{project.propertyType}</span>
      </div>

      <h3 className="mt-2 text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-bone-300">
        {project.summary}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-champagne-300">
        View project
        <ArrowUpRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}
