import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * Robots (PRD §5 finalization): allow everything launched, point at the
 * sitemap. AI search/answer crawlers are named explicitly (a crawler obeys the
 * most specific matching group) so their access is unambiguous and survives any
 * future tightening of the wildcard rule. Owner-only tools stay disallowed.
 */
// Named explicitly so their access is unambiguous. Roles differ by crawler:
//   search indexing: OAI-SearchBot, Claude-SearchBot, PerplexityBot
//   user-requested: ChatGPT-User, Claude-User (fetch on a person's prompt)
//   training/AI-opt: GPTBot, ClaudeBot, Google-Extended, Applebot-Extended
// All are allowed on public marketing content (owner wants AI discoverability);
// none of these govern ordinary Googlebot indexing, which the "*" rule allows.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
];

/**
 * Owner-only and customer-private areas.
 *
 * Every one of these already sends `robots: noindex` from its own layout, so
 * nothing here was ever at risk of ranking. They are listed anyway because a
 * meta tag only works after a crawler has fetched the page, and these are
 * pages nobody outside the company should be fetched at all: /pin is the
 * field tool, and /estimate/<token> is one named customer's private estimate.
 *
 * THE TRAILING SLASH ON /estimate/ IS LOAD-BEARING. "/estimate" is a public
 * marketing page that belongs in the index; "/estimate/" only matches the
 * token routes beneath it. Dropping the slash would quietly deindex a page we
 * want found.
 */
const DISALLOW = ["/studio", "/upload", "/production", "/pin", "/estimate/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
