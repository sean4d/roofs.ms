import type { MetadataRoute } from "next";

import { allServices } from "@/content/services";
import { cities } from "@/content/cities";
import { articlePath, learnArticles } from "@/content/learn";
import { blogPosts } from "@/content/blog";
import { absoluteUrl } from "@/lib/seo";

/**
 * Auto-generated sitemap (PRD §2). Only launched routes are listed —
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
  "/contact",
  "/service-areas",
  "/projects",
  "/reviews",
  "/about",
  "/careers",
  "/privacy-policy",
  "/terms-of-service",
  "/learn",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = launchedStaticRoutes.map((path) => ({
    url: absoluteUrl(path),
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
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...cityEntries,
    ...learnEntries,
    ...blogEntries,
  ];
}
