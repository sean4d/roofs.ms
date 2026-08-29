import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectCard } from "@/components/projects/project-card";
import { publishedProjects } from "@/config/projects";

export function FeaturedProjects() {
  const projects = publishedProjects().slice(0, 3);
  if (projects.length === 0) return null;

  return (
    <section className="band border-y border-white/[0.08] bg-ink-900">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-champagne-500">Recent work</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
              Properties we&rsquo;ve lit.
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-champagne-300 hover:text-champagne-200"
          >
            All projects
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
