/**
 * Which towns in the service area do NOT yet have a /service-areas page.
 *
 * WHY THIS IS ITS OWN MODULE. siteConfig.serviceArea is the list of places we
 * work. It is not the list of places that have a page, and four different
 * pieces of code treat it as if it were:
 *
 *   src/components/home/service-area.tsx       links every entry
 *   src/components/services/service-sections.tsx   links every entry
 *   src/app/(marketing)/service-areas/page.tsx  checks, correctly
 *   next.config.ts                             redirects /<slug>-services
 *
 * Three of those four published a link to whatever was in the list. Adding
 * Bassfield on 2026-10-05 therefore put sixteen internal links to a 404 on the
 * site (the homepage, every residential service page, both storm pages) and
 * aimed the legacy /bassfield-services redirect at one as well. A 301 into a
 * 404 is worse than the 404 it replaced: Google follows it expecting content,
 * finds none, and the old URL's equity goes nowhere.
 *
 * None of that threw an error. Every page still rendered, the build passed,
 * and the sitemap stayed clean, because the sitemap is built from the city
 * pages that exist rather than from this list.
 *
 * WHY A LIST OF EXCEPTIONS rather than reading the city content directly:
 * next.config.ts is loaded outside the app's module graph and does not resolve
 * the "@/" alias, so it cannot import the city content. A plain array of slugs
 * it can import relatively is the one shape that works in both places, and
 * check:seo-links asserts this list matches reality in both directions, so it
 * cannot drift.
 */
export const CITIES_WITHOUT_PAGES: readonly string[] = [];

/** True when /service-areas/<slug> is a real, indexable page. */
export function hasCityPage(slug: string): boolean {
  return !CITIES_WITHOUT_PAGES.includes(slug);
}
