import "server-only";

// The static set only. Sanity-backed jobs need a live fetch and this runs
// inside a print render, where a slow network call would hold up a document
// somebody is waiting to put in an envelope.
import { staticGalleryJobs } from "@/lib/gallery";

/**
 * Completed work near the property, for the mailed estimate.
 *
 * CITY LEVEL, AND THAT IS NOT A COMPROMISE, IT IS THE HONEST LIMIT. The
 * project records carry a city and a slug and no coordinates at all, so
 * "1.4 miles away" is a number this data cannot support. Printing it would be
 * making up a distance, and the whole advantage of this document is that
 * everything on it is something we actually did.
 *
 * So: "roofs we have completed in Hattiesburg", when there are some, and
 * nothing at all when there are not. A section that quietly disappears on an
 * address with no local work is better than one that pads itself.
 */

export interface NearbyProjects {
  city: string;
  count: number;
}

/**
 * The town out of a formatted address.
 *
 * Google returns "154 Peres Rd, Carriere, MS 39426, USA", so the town is the
 * second field. Falls back to nothing rather than guessing: a wrong town on
 * this section would be worse than no section.
 */
function cityFrom(address: string): string | null {
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length < 3) return null;
  const city = parts[1];
  return city && !/^\d/.test(city) ? city : null;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function nearbyProjects(address: string): NearbyProjects {
  const city = cityFrom(address);
  if (!city) return { city: "", count: 0 };

  const target = slug(city);
  const count = staticGalleryJobs().filter(
    (j) =>
      (j.citySlug && j.citySlug === target) ||
      (j.city && slug(j.city) === target),
  ).length;

  return { city, count };
}
