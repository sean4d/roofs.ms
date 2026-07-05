import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { blogPosts, formatPostDate } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/** Blog hub (PRD §13 Phase 7): news, storm updates, project stories. */

export const metadata: Metadata = buildMetadata({
  title: "Blog | Southeast Roofing",
  description:
    "News and updates from Southeast Roofing — storm response notes, project stories, and company announcements from South Mississippi.",
  path: "/blog",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export default function BlogHubPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              News from the crew
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Storm response notes, project stories, and company updates.
              For evergreen how-to guides, head to the{" "}
              <Link
                href="/learn"
                className="font-medium text-navy-900 underline underline-offset-4 hover:text-steel-500"
              >
                Learning Center
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <StaggerGroup as="ul" className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <StaggerItem as="li" key={post.slug} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="group shadow-premium flex h-full flex-col rounded-2xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl"
              >
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays
                      className="size-3.5 text-steel-500"
                      aria-hidden="true"
                    />
                    {formatPostDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock
                      className="size-3.5 text-steel-500"
                      aria-hidden="true"
                    />
                    {post.readMinutes} min read
                  </span>
                </span>
                <h2 className="mt-3 font-display text-xl font-bold text-navy-900">
                  {post.title}
                </h2>
                <p className="mt-2.5 flex-1 leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 group-hover:text-navy-900">
                  Read the post
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <FinalCta />
    </>
  );
}
