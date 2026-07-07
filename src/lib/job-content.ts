/**
 * Deterministic content generator for uploaded jobs. Turns the structured
 * /upload submission into everything the website + socials need:
 *   • an SEO project title + slug
 *   • per-photo SEO (title, alt text, meta description, SEO filename)
 *   • gallery filter tags (from the chosen options + description keywords)
 *   • a ready-to-post social caption
 *
 * No AI/API key required — the dropdown selections are cleaner structured
 * data than freeform text, so templated output is accurate and instant. An
 * AI pass can later enrich `metaDescription`/caption without changing callers.
 */

import { getJobType, type PhaseKey } from "@/config/job-taxonomy";
import { siteConfig } from "@/config/site";

export interface JobSubmission {
  jobType: string;
  channel: "residential" | "commercial";
  /** Resolved city label (custom text already substituted for "Other"). */
  city: string;
  /** Keyed by DetailField.key; value is string or string[] (multi). */
  details: Record<string, string | string[]>;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  completedAt: string;
  featured: boolean;
}

const REGION = siteConfig.address.addressRegion; // "MS"

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function str(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return (v ?? "").trim();
}

function arr(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v.filter(Boolean);
  return v ? [v] : [];
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Trim a verbose option ("Architectural / Dimensional") to its lead token. */
function shortOption(s: string): string {
  return s.split("/")[0].split("(")[0].trim();
}

/** Descriptive lead like "GAF Architectural" (brand + short product type). */
function productLead(sub: JobSubmission): string {
  const brand = str(sub.details.brand);
  const productType = shortOption(str(sub.details.productType));
  return [brand, productType].filter(Boolean).join(" ").trim();
}

/** Human title, e.g. "GAF Architectural Shingle Roof in Pewter Gray". */
export function jobTitle(sub: JobSubmission): string {
  const jt = getJobType(sub.jobType);
  const noun = titleCase(jt?.noun ?? "roofing project");
  const color = str(sub.details.color);

  let core: string;
  if (sub.jobType === "storm-damage") {
    const dmg = arr(sub.details.damage).slice(0, 2).join(" & ");
    core = dmg ? `Storm Damage — ${dmg}` : "Storm Damage";
  } else {
    const lead = productLead(sub);
    core = [lead, noun].filter(Boolean).join(" ");
    if (color) core += ` in ${titleCase(color)}`;
  }
  return sub.city ? `${core} — ${sub.city}, ${REGION}` : core;
}

/** Short one-liner for the project card / summary field. */
export function jobSummary(sub: JobSubmission): string {
  const jt = getJobType(sub.jobType);
  const where = sub.city ? ` in ${sub.city}, ${REGION}` : "";
  const lead = productLead(sub);
  const noun = jt?.noun ?? "roofing project";
  if (sub.jobType === "storm-damage") {
    const dmg = arr(sub.details.damage).join(", ").toLowerCase();
    return `Storm response${where}${dmg ? ` — documented ${dmg}` : ""}.`;
  }
  const what = [lead, noun].filter(Boolean).join(" ");
  return `${titleCase(sub.channel)} ${what}${where} by ${siteConfig.name}.`;
}

const DESCRIPTION_KEYWORDS: Record<string, string> = {
  leak: "Leak Repair",
  "tear off": "Full Tear-Off",
  "tear-off": "Full Tear-Off",
  insurance: "Insurance Claim",
  claim: "Insurance Claim",
  emergency: "Emergency",
  "two story": "2-Story",
  "2 story": "2-Story",
  "2-story": "2-Story",
  "new construction": "New Construction",
  ridge: "Ridge Vent",
  vent: "Ventilation",
  skylight: "Skylight",
  chimney: "Chimney",
  decking: "Decking Replacement",
  overlay: "Overlay",
  repair: "Repair",
  replacement: "Full Replacement",
};

/** Filter tags for the gallery — from filterable options, city, channel,
 *  job type, plus any keyword matches in the free description. */
export function jobTags(sub: JobSubmission): string[] {
  const jt = getJobType(sub.jobType);
  const tags = new Set<string>();

  if (jt) tags.add(jt.label);
  tags.add(titleCase(sub.channel));
  if (sub.city) tags.add(sub.city);

  for (const field of jt?.fields ?? []) {
    if (!field.filterable) continue;
    for (const value of arr(sub.details[field.key])) {
      if (value) tags.add(titleCase(shortOption(value)));
    }
  }

  const desc = sub.description.toLowerCase();
  for (const [needle, tag] of Object.entries(DESCRIPTION_KEYWORDS)) {
    if (desc.includes(needle)) tags.add(tag);
  }

  return [...tags];
}

const PHASE_WORD: Record<PhaseKey, string> = {
  before: "Before",
  progress: "In Progress",
  after: "After",
};

export interface PhotoSeo {
  title: string;
  alt: string;
  metaDescription: string;
  filename: string;
}

/** Per-photo SEO. `index`/`total` disambiguate multiple shots in a phase. */
export function photoSeo(
  sub: JobSubmission,
  phase: PhaseKey,
  index: number,
): PhotoSeo {
  const jt = getJobType(sub.jobType);
  const lead = productLead(sub);
  const noun = jt?.noun ?? "roofing project";
  const color = str(sub.details.color);
  const where = sub.city ? `${sub.city}, ${REGION}` : `South ${REGION}`;
  const phaseWord = PHASE_WORD[phase];

  const subject = [lead, noun].filter(Boolean).join(" ") || "roofing project";
  const colorPart = color ? ` in ${titleCase(color)}` : "";

  const title = `${phaseWord}: ${titleCase(subject)}${colorPart} — ${where}`;
  const alt =
    `${phaseWord} photo of a ${subject}${colorPart} ` +
    `${phase === "after" ? "completed" : phase === "progress" ? "being installed" : "before work"} ` +
    `by ${siteConfig.name} in ${where}.`;
  const metaDescription =
    `${siteConfig.name} ${sub.channel} ${subject}${colorPart} in ${where}. ` +
    `${phaseWord} photo from a real Southeast Mississippi job site.`;

  const filenameBase = slugify(
    [lead, noun, color, where, phaseWord, index + 1].filter(Boolean).join(" "),
  );

  return { title, alt, metaDescription, filename: `${filenameBase}.jpg` };
}

/** Multi-line social caption reused across FB / IG / GMB / TikTok / Nextdoor. */
export function socialCaption(sub: JobSubmission): string {
  const jt = getJobType(sub.jobType);
  const where = sub.city ? `${sub.city}, ${REGION}` : `South ${REGION}`;
  const lead = productLead(sub);
  const noun = jt?.noun ?? "roofing project";

  let headline: string;
  if (sub.jobType === "storm-damage") {
    const dmg = arr(sub.details.damage).join(", ").toLowerCase();
    headline = `Storm response in ${where}${dmg ? ` — ${dmg}` : ""}.`;
  } else {
    const what = [lead, noun].filter(Boolean).join(" ");
    headline = `Another ${what} done right in ${where}. ✅`;
  }

  const note = sub.description.trim();
  const cta =
    `📞 ${siteConfig.phone.display} · Free inspection & estimate` +
    (siteConfig.links.booking ? `\n📅 Book online: ${siteConfig.links.booking}` : "");

  const tags = jobTags(sub)
    .map((t) => "#" + t.replace(/[^A-Za-z0-9]+/g, ""))
    .slice(0, 6);
  const localTags = ["#Roofing", "#MississippiRoofer", "#SoutheastRoofing"];

  return [headline, note, cta, [...localTags, ...tags].join(" ")]
    .filter(Boolean)
    .join("\n\n");
}
