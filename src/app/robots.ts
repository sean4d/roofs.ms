import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * Robots (PRD §5 finalization): allow everything launched, point at the
 * sitemap. AI search/answer crawlers are named explicitly (a crawler obeys the
 * most specific matching group) so their access is unambiguous and survives any
 * future tightening of the wildcard rule. Owner-only tools stay disallowed.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
];

const DISALLOW = ["/studio", "/upload"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
