/**
 * Deterministic content generator for uploaded jobs. Turns the structured
 * /upload submission into everything the website + socials need:
 *   • an SEO project title + slug
 *   • per-photo SEO (title, alt text, meta description, SEO filename)
 *   • gallery filter tags (from the chosen options + description keywords)
 *   • a ready-to-post social caption
 *
 * No AI/API key required. The dropdown selections are cleaner structured
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
  featured: boolean;
  /** Optional customer contact, if present, an automatic Google review
   *  request is sent/prepared after the job posts. Never shown publicly. */
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
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

/** Descriptive lead, the specific product line (e.g. "GAF Timberline HDZ"),
 *  falling back to brand + type for older/other job types. */
function productLead(sub: JobSubmission): string {
  const product = str(sub.details.product);
  if (product) return product;
  // A coating has no product line, but it has a chemistry, and "silicone roof
  // coating" is what a reader needs to see rather than "roof coating".
  const coating = str(sub.details.coatingType);
  if (coating && coating !== "Other") return coating;
  const brand = str(sub.details.brand);
  const productType = shortOption(str(sub.details.productType));
  return [brand, productType].filter(Boolean).join(" ").trim();
}

/**
 * Lead plus noun, WITHOUT saying the noun twice.
 *
 * The gutter products are named 'Seamless 6" Gutters' and the job type's noun
 * is "gutters", so gluing them together produced 'Seamless 6" Gutters gutters'
 * on the gallery card, the photo alt text and the caption. It read as a bug
 * because it was one. If the product name already ends with the noun, the noun
 * has done its job and gets dropped.
 */
function leadWithNoun(lead: string, noun: string): string {
  if (!lead) return noun;
  if (lead.toLowerCase().endsWith(noun.toLowerCase())) return lead;
  return `${lead} ${noun}`;
}

/**
 * What was installed, as one noun phrase with the colour in front.
 *
 * The colour used to trail the noun as "in Charcoal", which is fine on its own
 * and falls apart the moment a sentence puts a place after it: "a roof coating
 * in White in Hattiesburg". As an adjective it never collides with the
 * location, and it is how somebody would actually say it out loud.
 */
function subjectPhrase(sub: JobSubmission): string {
  const jt = getJobType(sub.jobType);
  const noun = jt?.noun ?? "roofing project";
  const color = str(sub.details.color);
  const core = leadWithNoun(productLead(sub), noun);
  return color ? `${titleCase(color)} ${core}` : core;
}

/** Capitalise the first letter only, leaving product names alone. */
function sentenceCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Human title, e.g. "GAF Architectural Shingle Roof in Pewter Gray". */
export function jobTitle(sub: JobSubmission): string {
  const noun = getJobType(sub.jobType)?.noun ?? "roofing project";
  const color = str(sub.details.color);

  let core: string;
  if (sub.jobType === "storm-damage") {
    const dmg = arr(sub.details.damage).slice(0, 2).join(" & ");
    core = dmg ? `Storm Damage, ${dmg}` : "Storm Damage";
  } else {
    core = titleCase(leadWithNoun(productLead(sub), noun));
    if (color) core += ` in ${titleCase(color)}`;
  }
  // Parentheses, not a comma, for the location. The colour already sits in a
  // "in <Colour>" phrase, so "Shingle Roof in Shakewood, McComb, MS" reads like
  // two towns. (This used to be an em dash; those are gone site-wide.)
  return sub.city ? `${core} (${sub.city}, ${REGION})` : core;
}

/** Short one-liner for the project card / summary field. */
export function jobSummary(sub: JobSubmission): string {
  const jt = getJobType(sub.jobType);
  const where = sub.city ? ` in ${sub.city}, ${REGION}` : "";
  const lead = productLead(sub);
  const noun = jt?.noun ?? "roofing project";
  if (sub.jobType === "storm-damage") {
    const dmg = arr(sub.details.damage).join(", ").toLowerCase();
    return `Storm response${where}${dmg ? `: documented ${dmg}` : ""}.`;
  }
  const what = leadWithNoun(lead, noun);
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

/** Filter tags for the gallery: from filterable options, city, channel,
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

  const subject = leadWithNoun(lead, noun) || "roofing project";
  const colorPart = color ? ` in ${titleCase(color)}` : "";

  const title = `${phaseWord}: ${titleCase(subject)}${colorPart}, ${where}`;
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

/**
 * Six openings, rotated by the job, so the fallback does not have the fault
 * the AI prompt had.
 *
 * This template used to be one sentence: "Another X done right in Y." Every
 * post that fell back to it opened identically, which is the same complaint
 * the owner made about the AI captions and the same cause: one shape, used
 * every time. These are written to differ in what the sentence is about, not
 * just in its adjectives.
 */
const OPENERS: Array<(what: string, where: string, a: string) => string> = [
  (what, where, a) => `${a ? "A new" : "New"} ${what} in ${where}.`,
  (what, where, a) => `${where} picked up ${a}${what} this week.`,
  (what, where, a) => `This one is ${a}${what}, out in ${where}.`,
  (what, where) => `Fresh ${what} on a property in ${where}.`,
  (what, where) =>
    `${sentenceCase(what)}, finished and handed over in ${where}.`,
  (what, where, a) => `Work wrapped on ${a}${what} in ${where}.`,
];

/**
 * "a " or nothing, because some of the job types are plural nouns.
 *
 * Gutters, gutter guards and siding do not take an article, and "a White
 * Seamless 6in Gutters" is the kind of sentence that tells a reader instantly
 * that nobody wrote it.
 */
function articleFor(sub: JobSubmission): string {
  const noun = getJobType(sub.jobType)?.noun ?? "";
  return /(gutters|guards|siding)$/i.test(noun) ? "" : "a ";
}

const CLOSERS = [
  "Quality materials, clean workmanship, and a customer we were glad to work for.",
  "Installed to manufacturer spec, cleaned up properly, and inspected before we left.",
  "The kind of job that looks simple because it was done in the right order.",
  "Built for what the weather does here, not for what it does on a brochure.",
];

/** Stable index from a string. FNV-1a: short, dependency free, spreads well. */
function pick(seed: string, length: number): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h) % length;
}

/**
 * Deterministic, polished caption body, NEVER the owner's raw notes verbatim.
 * Used as the fallback when AI polish (lib/ai-caption) isn't available.
 */
export function deterministicBody(sub: JobSubmission): string {
  const where = sub.city ? `${sub.city}, ${REGION}` : `South ${REGION}`;
  const seed = [sub.city, sub.jobType, sub.channel, sub.description]
    .filter(Boolean)
    .join("|");

  if (sub.jobType === "storm-damage") {
    const dmg = arr(sub.details.damage).join(", ").toLowerCase();
    return (
      `Storm response in ${where}${dmg ? `, addressing ${dmg}` : ""}. ` +
      `Our crew documented the damage and got this ${sub.channel} property protected.`
    );
  }

  const what = subjectPhrase(sub);
  const opener = OPENERS[pick(seed, OPENERS.length)];
  const closer = CLOSERS[pick(`${seed}#close`, CLOSERS.length)];
  return `${opener(what, where, articleFor(sub))} ${closer}`;
}

/** Wrap a caption body with the shared CTA + hashtags (all platforms). */
export function assembleCaption(sub: JobSubmission, body: string): string {
  const cta =
    `📞 ${siteConfig.phone.display} · Free inspection & estimate` +
    (siteConfig.links.booking
      ? `\n📅 Book online: ${siteConfig.links.booking}`
      : "");
  const tags = jobTags(sub)
    .map((t) => "#" + t.replace(/[^A-Za-z0-9]+/g, ""))
    .slice(0, 6);
  const localTags = ["#Roofing", "#MississippiRoofer", "#SoutheastRoofing"];
  return [body.trim(), cta, [...localTags, ...tags].join(" ")]
    .filter(Boolean)
    .join("\n\n");
}

/** Full caption from the deterministic body (fallback path). */
export function socialCaption(sub: JobSubmission): string {
  return assembleCaption(sub, deterministicBody(sub));
}
