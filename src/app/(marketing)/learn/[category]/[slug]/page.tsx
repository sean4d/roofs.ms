import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import {
  articlePath,
  articlesByCategory,
  getArticle,
  learnArticles,
  learnCategories,
} from "@/content/learn";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ArticleBody } from "@/components/learn/article-body";
import { ServiceFaq } from "@/components/services/service-faq";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { FinalCta } from "@/components/home/final-cta";

/**
 * Learning Center article route (PRD §13 Phase 7): registry-driven like
 * services and cities — new article = one entry in content/learn.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return learnArticles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  return buildMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: articlePath(article),
  });
}

export default async function LearnArticlePage({
  params,
}: PageProps<"/learn/[category]/[slug]">) {
  const { category, slug } = await params;
  const article = getArticle(category, slug)!;
  const categoryMeta = learnCategories.find(
    (entry) => entry.slug === article.category,
  )!;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Learning Center", path: "/learn" },
    { name: article.title, path: articlePath(article) },
  ];

  const moreInCategory = articlesByCategory(article.category).filter(
    (entry) => entry.slug !== article.slug,
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          headline: article.title,
          description: article.metaDescription,
          path: articlePath(article),
          datePublished: article.updated,
        })}
      />
      {article.faqs && article.faqs.length > 0 && (
        <JsonLd data={faqSchema(article.faqs)} />
      )}

      {/* Article hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site py-14 sm:py-16">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <BookOpen
                  className="size-3.5 text-steel-500"
                  aria-hidden="true"
                />
                {categoryMeta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <Clock className="size-3.5 text-steel-500" aria-hidden="true" />
                {article.readMinutes} min read
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              {article.hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              {article.hero.subhead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <Section>
        <ArticleBody blocks={article.body} />
      </Section>

      {article.faqs && article.faqs.length > 0 && (
        <ServiceFaq faqs={article.faqs} title="Quick answers" />
      )}

      {/* Related services + more reading */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-navy-900">
              Put this to work
            </h2>
            <StaggerGroup as="ul" className="mt-6 flex flex-wrap gap-3">
              {article.related.map((link) => (
                <StaggerItem as="li" key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md"
                  >
                    {link.label}
                    <ArrowRight
                      className="size-3.5 text-steel-500"
                      aria-hidden="true"
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-2xl font-bold text-navy-900">
              Keep learning
            </h2>
            <ul className="mt-6 space-y-3">
              {(moreInCategory.length > 0
                ? moreInCategory
                : learnArticles.filter((entry) => entry.slug !== article.slug)
              )
                .slice(0, 3)
                .map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={articlePath(entry)}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md"
                    >
                      <span className="font-semibold text-navy-900">
                        {entry.title}
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-steel-500 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
