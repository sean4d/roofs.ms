import { readFileSync } from "node:fs";

import { siteConfig } from "@/config/site";
import { cities } from "@/content/cities";
import { CITIES_WITHOUT_PAGES, hasCityPage } from "@/config/service-area-pages";

/**
 * The service area is where we WORK. It is not the list of pages that exist,
 * and treating it as if it were put sixteen links to a 404 on the live site.
 *
 * WHAT HAPPENED. Bassfield was added to siteConfig.serviceArea on 2026-10-05.
 * Four pieces of code read that list: two components link every entry, the
 * service-areas hub checks whether a page exists, and next.config turns each
 * entry into a /<slug>-services redirect. Three of the four did not check.
 *
 * So the homepage, every residential service page and both storm pages
 * published a link to /service-areas/bassfield, which 404s, and the legacy
 * /bassfield-services redirect pointed into the same hole. A 301 into a 404 is
 * worse than the 404 it replaced, because Google follows it expecting content
 * and the old URL's equity goes nowhere.
 *
 * Nothing failed. Every page rendered, the build passed, the sitemap stayed
 * clean (it is built from the pages that exist, not from this list), and only
 * a crawl of the live HTML showed it.
 *
 * This file is the thing that would have caught it. It asserts the exception
 * list matches reality in BOTH directions, so neither adding a town nor
 * shipping its page can leave the two out of step.
 *
 * Run: npm run check:seo-links
 */

let failures = 0;
function check(ok: boolean, label: string, detail?: string) {
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}`);
  if (!ok) {
    failures++;
    if (detail) console.log(`        ${detail}`);
  }
}

const read = (rel: string) =>
  readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");

console.log("\nEvery town we link has a page to land on");

const launched = new Set(cities.map((c) => c.slug));
const areaSlugs = siteConfig.serviceArea.map((c) => c.slug);

// Direction 1: a town with no page must be on the exception list.
const missingFromList = areaSlugs.filter(
  (s) => !launched.has(s) && hasCityPage(s),
);
check(
  missingFromList.length === 0,
  "every service-area town without a page is excluded from linking",
  missingFromList.length
    ? `add to CITIES_WITHOUT_PAGES: ${missingFromList.join(", ")}`
    : undefined,
);

// Direction 2: once the page ships, the exception has to come off, or the town
// silently stays unlinked and the page gets no internal links at all. That
// failure is quieter than the first one and costs more.
const staleExceptions = CITIES_WITHOUT_PAGES.filter((s) => launched.has(s));
check(
  staleExceptions.length === 0,
  "no town is excluded from linking after its page has shipped",
  staleExceptions.length
    ? `remove from CITIES_WITHOUT_PAGES: ${staleExceptions.join(", ")}`
    : undefined,
);

// And the exception list cannot name a town we do not serve.
const areaSlugSet = new Set<string>(areaSlugs);
const unknown = CITIES_WITHOUT_PAGES.filter((s) => !areaSlugSet.has(s));
check(
  unknown.length === 0,
  "the exception list only names towns in the service area",
  unknown.join(", "),
);

console.log("\nAll four readers of the service area check before linking");

for (const [file, label] of [
  ["src/components/home/service-area.tsx", "the homepage service area"],
  ["src/components/services/service-sections.tsx", "the service page strip"],
] as const) {
  check(
    read(file).includes("hasCityPage"),
    `${label} links only towns with a page`,
    "this one linked every entry, which is how the 404s shipped",
  );
}
check(
  read("src/app/(marketing)/service-areas/page.tsx").includes("launched"),
  "the service-areas hub renders unlaunched towns as plain text",
);
const config = read("next.config.ts");
check(
  /legacyCityRedirects[\s\S]{0,400}hasCityPage/.test(config),
  "the legacy /<city>-services redirects skip towns with no page",
  "a 301 into a 404 is worse than the 404 it replaced",
);
check(
  /legacyCompactCityRedirects[\s\S]{0,300}hasCityPage/.test(config),
  "the no-hyphen legacy aliases skip them too",
);

console.log(
  failures === 0
    ? "\nAll SEO link checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
