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
      className="group cell overflow-hidden rounded-card border border-white/[0.09] transition-colors hover:border-champagne-400/40"
    >
      <div className="cell-media">
        <Image
          src={project.hero.src}
          alt={project.hero.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={project.hero.blurDataURL}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {project.isDemo ? (
          <span className="absolute top-3 left-3 rounded-md border border-amber-300/40 bg-ink-950/80 px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide text-amber-200 uppercase">
            Demo content
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-champagne-300">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" strokeWidth={2} />
            {project.city}, MS
          </span>
          <span className="text-bone-500">{project.propertyType}</span>
        </div>

        <h3 className="mt-2.5 text-lg font-semibold">{project.title}</h3>
        <p className="text-bone-400 mt-2 text-sm leading-relaxed">
          {project.summary}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-medium text-champagne-300">
          View project
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}
