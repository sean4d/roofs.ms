import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { PROJECTS, projectBySlug, publishedProjects } from "@/config/projects";
import { serviceBySlug } from "@/config/services";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title}, ${project.city} MS`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.hero.src,
    // Demo entries must never be indexed as though they were real work.
    noIndex: project.isDemo,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ];

  const services = project.serviceSlugs
    .map((slug) => serviceBySlug(slug))
    .filter((s) => s !== undefined);
  const others = publishedProjects()
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <section className="relative isolate overflow-hidden">
        <Image
          src={project.hero.src}
          alt={project.hero.alt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={project.hero.blurDataURL}
          className="-z-10 object-cover"
        />
        <div className="scrim-subject absolute inset-0 -z-10" />
        <div className="container-site relative flex min-h-[56svh] flex-col justify-end pt-32 pb-14">
          {project.isDemo ? (
            <span className="mb-4 w-fit rounded-md border border-amber-300/40 bg-amber-300/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-amber-100 uppercase">
              Demo content · not a Southeast Lights installation
            </span>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-champagne-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" strokeWidth={2} />
              {project.city}, MS
            </span>
            <span className="text-bone-500">{project.propertyType}</span>
            {project.year ? (
              <span className="text-bone-500">{project.year}</span>
            ) : null}
          </div>
          <h1 className="mt-3 max-w-3xl text-[2.2rem] leading-[1.08] font-semibold text-balance sm:text-5xl">
            {project.title}
          </h1>
        </div>
      </section>
      <Breadcrumbs trail={trail} />

      <Section eyebrow="Scope" title="What we did.">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-bone-300">
              {project.scope}
            </p>
            <ul className="mt-7 flex flex-col gap-3">
              {project.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-bone-300">
                  <Check
                    className="mt-1 size-4 shrink-0 text-champagne-400"
                    strokeWidth={2.5}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-lit h-fit p-6">
            <h2 className="text-sm font-semibold text-bone-100">
              Services used
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-champagne-300 hover:text-champagne-200"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-sm font-semibold text-bone-100">
              Location
            </h2>
            <p className="text-bone-400 mt-2 text-sm">
              {project.city}, Mississippi
            </p>
          </div>
        </div>
      </Section>

      {project.gallery.length > 0 ? (
        <Section tone="raised" eyebrow="Gallery" title="More from this project">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((item, index) => (
              <figure
                key={`${item.image.src}-${index}`}
                className="card-lit overflow-hidden"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={item.image.blurDataURL}
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-bone-400 px-5 py-4 text-sm">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {others.length > 0 ? (
        <Section eyebrow="More work" title="Other projects">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/projects/${other.slug}`}
                className="card-lit group relative isolate flex min-h-[15rem] flex-col justify-end overflow-hidden p-6"
              >
                <Image
                  src={other.hero.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL={other.hero.blurDataURL}
                  className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="scrim-soft absolute inset-0 -z-10" />
                <h3 className="text-lg font-semibold">{other.title}</h3>
                <p className="mt-1 text-xs text-champagne-300">
                  {other.city}, MS
                </p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title="Something like this for your property?"
        body="Send the address and we will design it and price it."
        location={`project_${project.slug}_cta`}
      />
    </>
  );
}
