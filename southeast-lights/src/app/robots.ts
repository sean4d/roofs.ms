import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Robots.
 *
 * Legitimate search and AI crawlers are deliberately NOT blocked. Being
 * cited by an AI assistant is a discovery channel we want, and blocking those
 * agents to protect content we published on purpose would be self-defeating.
 *
 * Only the API surface is disallowed: it has no crawlable content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
