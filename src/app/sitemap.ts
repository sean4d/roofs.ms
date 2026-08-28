import type { MetadataRoute } from "next";

import { allServices } from "@/content/services";
import { cities } from "@/content/cities";
import { articlePath, learnArticles } from "@/content/learn";
import { blogPosts } from "@/content/blog";
import { getProjectSitemapEntries } from "@/sanity/lib/queries";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/config/site";

/**
 * Auto-generated sitemap (PRD §2). Only launched routes are listed,
 * reserved routes stay out until their phase ships (full finalization
 * pass, including robots, lands in Phase 5).
 */

const launchedStaticRoutes = [
  "/",
  "/residential",
  "/commercial",
  "/commercial/industries",
  "/commercial/request-consultation",
  "/metal-roofing",
  "/storm-damage",
  "/financing",
  "/free-inspection",
  "/estimate",
  "/storm-inspection",
  "/repair",
  "/contact",
  "/service-areas",
  "/projects",
  "/reviews",
  "/about",
  "/careers",
  "/privacy-policy",
  "/terms-of-service",
  "/learn",
  "/faq",
  "/blog",
  "/quote",
  "/storm-center",
  "/roofing-tools",
  "/roof-cost-calculator",
  "/roof-color-visualizer",
  "/anatomy-of-a-roof",
  "/storm-damage/insurance-claims/wizard",
  "/project-map",
  "/roof-assistant",
  "/roof-damage-analyzer",
];

/**
 * <lastmod> for one URL, or undefined when we don't genuinely know.
 *
 * Google uses lastmod to decide what to recrawl, but only while it stays
 * consistent with what actually changes. Stamping "now" on every URL each
 * deploy is worse than sending nothing: the signal gets ignored, and with it
 * the pages that really did change. So only pages with a real recorded date
 * (learn articles, blog posts, Sanity projects) carry one, and the rest ship
 * bare, which is valid and honest.
 */
function lastMod(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = launchedStaticRoutes.map((path) => ({
    // Homepage: emit the bare origin (no trailing slash) so the sitemap entry
    // matches the self-referencing canonical Next renders for "/"
    // (https://southeastroofing.llc). absoluteUrl("/") would add a trailing
    // slash and read as a non-self-canonical mismatch in crawlers.
    url: path === "/" ? siteConfig.url : absoluteUrl(path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const serviceEntries = allServices.map((service) => ({
    url: absoluteUrl(service.path),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityEntries = cities.map((city) => ({
    url: absoluteUrl(`/service-areas/${city.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const learnEntries = learnArticles.map((article) => ({
    url: absoluteUrl(articlePath(article)),
    lastModified: lastMod(article.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: lastMod(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Individual project pages (from Sanity). Falls back to none if unreachable.
  const projects = await getProjectSitemapEntries();
  const projectEntries = projects.map((p) => ({
    url: absoluteUrl(`/projects/${p.slug}`),
    lastModified: lastMod(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...cityEntries,
    ...learnEntries,
    ...blogEntries,
    ...projectEntries,
  ];
}
