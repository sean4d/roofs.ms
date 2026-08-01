import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Phone } from "lucide-react";

import { getProjectBySlug, getProjectSlugs } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/config/site";
import { slugify } from "@/lib/job-content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import type { JsonLdObject } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Individual project page — each completed job is its own indexable, schema-rich
 * URL (AI-discoverability priority). Photos carry per-image alt/SEO from upload;
 * emits BreadcrumbList + ImageObject structured data. New jobs render on demand
 * (dynamicParams stays on) so uploads don't require a rebuild.
 */

const PHASE_LABEL: Record<string, string> = {
  before: "Before",
  progress: "In progress",
  after: "After",
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description:
      project.summary ??
      `${project.title} — a completed project by ${siteConfig.name}.`,
    path: `/projects/${slug}`,
    titleAbsolute: true,
  });
}

export default async function ProjectDetailPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const media = (project.media ?? []).filter((m) => m.ref);
  // Finished work leads the page; before/during-install sit in their own
  // labelled section below. A job with no "after" photos falls back to showing
  // everything up top rather than rendering an empty hero.
  const afters = media.filter((m) => m.phase === "after");
  const finished = afters.length > 0 ? afters : media;
  const process = afters.length > 0 ? media.filter((m) => m.phase !== "after") : [];
  const citySlug = project.city ? slugify(project.city) : null;
  const cityIsServiceArea = siteConfig.serviceArea.some((c) => c.slug === citySlug);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${slug}` },
  ];

  // Structured data: breadcrumb trail + one ImageObject per photo.
  const imageSchema: JsonLdObject[] = media.map((m) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: urlFor({ _type: "image", asset: { _ref: m.ref! } })
      .width(1600)
      .url(),
    caption: m.alt ?? project.title,
    description: m.metaDescription ?? undefined,
    creator: { "@type": "Organization", name: siteConfig.name },
    contentLocation: project.city ? `${project.city}, ${siteConfig.address.addressRegion}` : undefined,
  }));

  const detailRows = (project.details ?? []).filter((d) => d.value);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), ...imageSchema]} />

      <article className="border-b border-border bg-white">
        <div className="container-site py-10 sm:py-14">
          <Breadcrumbs items={breadcrumbs} />

          <h1 className="mt-6 max-w-3xl font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            {project.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {project.city && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm font-medium text-navy-900">
                <MapPin className="size-4 text-steel-500" aria-hidden="true" />
                {project.city}, {siteConfig.address.addressRegion}
              </span>
            )}
            {(project.tags ?? []).slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          {project.summary && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              {project.summary}
            </p>
          )}

          {/* Finished work leads. This is the page Google Business Profile's
              "Learn more" button lands on, so it opens on the completed roof —
              never on decking (owner rule 2026-08-01). */}
          {finished.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {finished.map((m, i) => (
                <figure
                  key={`finished-${i}`}
                  className="overflow-hidden rounded-2xl border border-border bg-secondary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor({ _type: "image", asset: { _ref: m.ref! } })
                      .width(1200)
                      .url()}
                    alt={m.alt ?? project.title}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          )}

          {/* The work behind it — before and during-install shots, clearly
              sectioned so nothing here can be mistaken for the finished roof. */}
          {process.length > 0 && (
            <section className="mt-12 rounded-2xl border border-border bg-secondary/40 p-5 sm:p-7">
              <h2 className="font-display text-xl font-bold text-navy-900">
                What it took to get there
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                The starting condition and the work in progress — the part most
                roofing photos leave out.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {process.map((m, i) => (
                  <figure
                    key={`process-${i}`}
                    className="overflow-hidden rounded-2xl border border-border bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlFor({ _type: "image", asset: { _ref: m.ref! } })
                        .width(1200)
                        .url()}
                      alt={m.alt ?? project.title}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                    {m.phase && PHASE_LABEL[m.phase] && (
                      <figcaption className="px-4 py-2 text-xs font-semibold tracking-wide text-steel-500 uppercase">
                        {PHASE_LABEL[m.phase]}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Job details */}
          {detailRows.length > 0 && (
            <dl className="mt-10 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {detailRows.map((d) => (
                <div key={d.key} className="bg-white px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-steel-500">
                    {d.label}
                  </dt>
                  <dd className="mt-0.5 font-medium text-navy-900">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* CTAs + internal links */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/free-inspection"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white"
            >
              Get a roof like this — free inspection
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {siteConfig.phone.tel && (
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold text-navy-900"
              >
                <Phone className="size-4 text-steel-500" aria-hidden="true" />
                {siteConfig.phone.display}
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/projects" className="font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500">
              ← All projects
            </Link>
            {cityIsServiceArea && citySlug && (
              <Link
                href={`/service-areas/${citySlug}`}
                className="font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500"
              >
                Roofing in {project.city}
              </Link>
            )}
          </div>
        </div>
      </article>

      <FinalCta />
    </>
  );
}
