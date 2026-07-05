import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";

import { blogPosts, formatPostDate, getPost } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ArticleBody } from "@/components/learn/article-body";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/home/final-cta";

/** Blog post route — registry-driven, same block system as /learn. */

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug)!;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          headline: post.title,
          description: post.metaDescription,
          path: `/blog/${post.slug}`,
          datePublished: post.date,
        })}
      />

      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <CalendarDays
                  className="size-3.5 text-steel-500"
                  aria-hidden="true"
                />
                {formatPostDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <Clock className="size-3.5 text-steel-500" aria-hidden="true" />
                {post.readMinutes} min read
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              {post.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <Section>
        <ArticleBody blocks={post.body} />
      </Section>

      <FinalCta />
    </>
  );
}
