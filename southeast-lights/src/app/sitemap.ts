import type { MetadataRoute } from "next";

import { publishedProjects } from "@/config/projects";
import { SERVICE_AREAS } from "@/config/service-areas";
import { enabledServices } from "@/config/services";
import { siteConfig } from "@/config/site";
import { VERTICALS } from "@/config/verticals";

/**
 * Sitemap.
 *
 * Holiday pages are listed year-round regardless of season. The seasonal
 * engine changes visual hierarchy only; hiding holiday URLs in July would
 * destroy the evergreen rankings those pages exist to earn.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/holiday-lighting", 0.9, "weekly"),
    entry("/commercial", 0.9, "weekly"),
    entry("/estimator", 0.9),
    entry("/quote", 0.8),
    entry("/commercial/request-proposal", 0.8),
    entry("/services", 0.8),
    entry("/projects", 0.7),
    entry("/service-areas", 0.7),
    entry("/inspiration", 0.6),
    entry("/about", 0.6),
    entry("/faq", 0.7),
    entry("/reviews", 0.6),
    entry("/contact", 0.6),
    ...enabledServices().map((s) => entry(`/services/${s.slug}`, 0.8)),
    ...VERTICALS.map((v) => entry(`/commercial/${v.slug}`, 0.8)),
    ...SERVICE_AREAS.map((a) =>
      entry(`/service-areas/${a.slug}`, a.tier === "home" ? 0.9 : 0.7),
    ),
    // Demo projects are excluded by publishedProjects() in production.
    ...publishedProjects().map((p) => entry(`/projects/${p.slug}`, 0.5)),
    entry("/privacy-policy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
    entry("/accessibility", 0.2, "yearly"),
  ];
}
