/**
 * What the weekly Google Business Profile Update should say and show.
 *
 * The original cron always grabbed the single newest project and its first
 * finished photo, so in any week without a new upload it reposted the same
 * picture. Three consecutive Updates ended up identical-looking on the profile
 * (owner flagged it 2026-08-21).
 *
 * Two things fix that. Photos now rotate across every project we have, and no
 * photo repeats until the whole library has been used. Copy runs through the
 * six evergreen messages first, then switches to AI-written industry updates so
 * the profile never runs out of things to say.
 *
 * State lives in a single Sanity document (`gbpAuto`) because Google's own post
 * list rehosts our images on its CDN, so there is no way to look at a live post
 * and tell which of our photos it came from.
 */

import type { SanityClient } from "next-sanity";

export const GBP_STATE_ID = "gbpAuto";

export interface GbpAutoState {
  _id: string;
  _type: "gbpAuto";
  /** Sanity asset _refs already published to the profile. */
  usedPhotoIds?: string[];
  /** Evergreen message indexes and AI topics already used. */
  usedTopics?: string[];
  postCount?: number;
}

/** Evergreen messages. No dated claims, no invented numbers. */
export const EVERGREEN = [
  "Roof been through a few Mississippi summers? A free inspection tells you honestly whether you need a repair, a replacement, or nothing yet, with photos to back it up. No pressure, no obligation.",
  "Storm season is a fact of life here. The best time to check your roof is before the next system. We document everything so you're covered if a claim ever comes. Book a free inspection anytime.",
  "Thinking about metal vs. shingle? We install both across South Mississippi and will quote them side by side from one free inspection, so you decide with real numbers, not averages off the internet.",
  "Every roof we build is priced line by line: shingle, underlayment, flashing, disposal, so you see exactly what you're paying for. Nothing pre-checked, no surprises. Ask us for an itemized proposal.",
  "Licensed (MSBOC #R22245), GAF-certified, BBB A+ rated, and 5-star reviewed on Google, and still here after the storm-chasers leave. Get a free, no-obligation roof inspection from a local crew.",
  "Missing shingles, a ceiling stain, or granules in the gutter? Those small signs are cheapest to fix early. Send us a photo or book a free inspection and we'll tell you straight what's going on.",
];

/**
 * Topic seeds for the AI updates. Each is a real thing a South Mississippi
 * homeowner searches, which is where the keyword value comes from. When every
 * seed has been used the generator is asked for a fresh angle instead.
 */
export const TOPICS = [
  "why black streaks appear on roofs in humid climates and what actually removes them",
  "roof ventilation, ridge vents and soffit intake, and what poor airflow costs a roof",
  "how to tell hail damage from wind damage on an asphalt shingle roof",
  "what a roof decking replacement is and when it becomes necessary during a tear-off",
  "ice and water shield and where it belongs on a Gulf Coast roof",
  "how long an architectural shingle roof actually lasts in South Mississippi heat",
  "standing seam versus exposed fastener metal roofing for homes and outbuildings",
  "what drip edge does and why missing drip edge causes fascia rot",
  "gutter sizing and why 6-inch seamless gutters matter under heavy Gulf rainfall",
  "reading a roofing proposal, what line items should always be itemized",
  "what to do in the first 48 hours after storm damage to a roof",
  "roof flashing at chimneys, walls and valleys, where most leaks actually start",
  "pine straw and tree debris, how overhanging limbs shorten a roof's life",
  "why a roof leak shows up inside far from where the water gets in",
  "shingle wind ratings explained, and what they mean during hurricane season",
  "attic insulation and its relationship to roof temperature and shingle aging",
  "how roofing insurance claims work in Mississippi and what adjusters look for",
  "underlayment types, felt versus synthetic, and what changes in the field",
  "signs a roof needs replacing rather than repairing",
  "roof pitch and how slope affects material choice and installation cost",
  "starter strip and ridge cap, the small components that fail first",
  "skylights and solar tubes, flashing them properly during a reroof",
  "commercial low-slope roofing options for small business buildings",
  "what a roof warranty covers, manufacturer versus workmanship",
];

/** Pick the next unused item, falling back to the least recently used. */
export function nextUnused<T>(all: T[], used: string[], key: (t: T) => string): {
  item: T;
  exhausted: boolean;
} {
  const usedSet = new Set(used);
  const fresh = all.filter((a) => !usedSet.has(key(a)));
  if (fresh.length) return { item: fresh[0], exhausted: false };
  // Everything has been used at least once: start the cycle again from the
  // item used longest ago (i.e. earliest in the used list).
  const order = new Map(used.map((k, i) => [k, i]));
  const sorted = [...all].sort(
    (a, b) => (order.get(key(a)) ?? 0) - (order.get(key(b)) ?? 0),
  );
  return { item: sorted[0], exhausted: true };
}

/**
 * Write a short Business Profile update about a roofing topic.
 *
 * Deliberately constrained: no statistics, no prices, no dated claims, and no
 * promises the business has not made elsewhere. Returns null when there is no
 * API key or the call fails, and the caller falls back to an evergreen message.
 */
export async function generateUpdate(topic: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const prompt =
    `Write a Google Business Profile update for a licensed, GAF-certified ` +
    `roofing contractor in Hattiesburg, Mississippi serving the Pine Belt and ` +
    `Gulf Coast.\n\n` +
    `TOPIC: ${topic}\n\n` +
    `Write 3 to 5 sentences, 600 characters maximum. Explain the topic plainly ` +
    `and usefully to a homeowner, the way a working roofer would on a porch. ` +
    `Work in natural local and roofing search terms without stuffing them. End ` +
    `with a light invitation to a free inspection.\n\n` +
    `RULES: Do NOT invent statistics, percentages, prices, dates, awards or ` +
    `warranty terms. Do NOT claim specific past jobs. No hashtags. No emoji. ` +
    `Never use an em dash; use a comma, a full stop, or a colon instead. ` +
    `Return ONLY the update text.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data.content?.[0]?.text?.trim();
    if (!text) return null;
    // Belt and braces on the house style, same as the caption generator.
    return text.replace(new RegExp(`\\s*${String.fromCharCode(0x2014)}\\s*`, "g"), ", ");
  } catch {
    return null;
  }
}

/** Load the rotation state, creating it on first run. */
export async function loadState(client: SanityClient): Promise<GbpAutoState> {
  const doc = (await client.fetch(`*[_id == $id][0]`, {
    id: GBP_STATE_ID,
  })) as GbpAutoState | null;
  return (
    doc ?? { _id: GBP_STATE_ID, _type: "gbpAuto", usedPhotoIds: [], usedTopics: [], postCount: 0 }
  );
}

/** Record what went out, trimming history so the document cannot grow forever. */
export async function saveState(
  client: SanityClient,
  state: GbpAutoState,
  photoId: string | undefined,
  topicKey: string,
): Promise<void> {
  const usedPhotoIds = [...(state.usedPhotoIds ?? [])];
  if (photoId) usedPhotoIds.push(photoId);
  const usedTopics = [...(state.usedTopics ?? []), topicKey];
  await client.createOrReplace({
    _id: GBP_STATE_ID,
    _type: "gbpAuto",
    usedPhotoIds: usedPhotoIds.slice(-400),
    usedTopics: usedTopics.slice(-200),
    postCount: (state.postCount ?? 0) + 1,
  });
}
