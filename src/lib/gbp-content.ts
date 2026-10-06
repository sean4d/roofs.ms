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

/**
 * Strip a "swipe to see the before and after" opener.
 *
 * A Google Business Profile Update carries exactly ONE photo and has no
 * swipe gesture at all, so a caption that opens by telling the reader to swipe
 * is instructing them to do something the surface cannot do. Four live posts
 * did this before the owner caught it (2026-10-06), including one that said
 * "Swipe to see the before and after!" above a single finished roof.
 *
 * TWO DIFFERENT SOURCES, which is why this matches loosely rather than
 * matching one known string. The carousel builder prepends a fixed template,
 * and the AI caption writer sometimes produces its own variant despite being
 * told not to open that way: the Bassfield post had no leading emoji, so it
 * came from the model, not the template. Anything whose first line is a swipe
 * instruction goes.
 *
 * Only the FIRST line is considered. A sentence in the middle of a caption
 * that happens to contain the word is left alone, because removing text from
 * the middle of somebody's copy is a worse failure than leaving it.
 */
/**
 * Turn a caption written for a social carousel into one that suits a Google
 * Business Profile Update.
 *
 * Two things do not survive the trip, and both are the same kind of mistake:
 * an Instagram habit applied to a surface that has no such feature.
 *
 *   The swipe cue   a Business Profile Update carries one photo and has no
 *                   swipe gesture. See stripSwipeCue.
 *   The hashtags    Google Business Profile has no hashtag feature at all.
 *                   They are not indexed, not clickable and not searchable
 *                   there. On a business listing a row of them reads as
 *                   leftover social copy, which is exactly what it is.
 *
 * Only whole hashtag lines are removed. A hash inside a sentence stays, which
 * matters because the licence number is written "#R22245" and dropping it
 * would take a real credential off the post.
 */
export function googleSummary(caption: string): string {
  return stripSwipeCue(caption)
    .split("\n")
    .filter((line) => !/^\s*(#[\w-]+[ \t]*)+$/.test(line))
    .join("\n")
    .trim();
}

export function stripSwipeCue(caption: string): string {
  const [first, ...rest] = caption.split("\n");
  const isCue =
    /swipe/i.test(first) &&
    // A cue is short and is about the photos. A real opening sentence that
    // merely mentions swiping would not be this terse.
    first.replace(/[^\p{L}\s]/gu, "").trim().length <= 60;
  if (!isCue) return caption;
  return rest.join("\n").replace(/^\s+/, "");
}

/**
 * Narrow the photo pool to jobs that match what the post is about.
 *
 * WHY. The topic and the photo were picked independently, so the 5 October
 * Update explained black streaks on shingle roofs above a photograph of a
 * brand new burgundy METAL roof. Nothing was wrong with either half. They had
 * simply never been introduced.
 *
 * The match is deliberately coarse, on the job slug, because the slug already
 * carries the system and product: "gaf-timberline-hdz-shingle-roof-in-hickory",
 * "29ga-gibraltar-rib-metal-roof-in-burgundy", "seamless-6-k-style-gutters",
 * "silicone-roof-coating-in-white". No new data to maintain.
 *
 * IT NARROWS, IT NEVER EMPTIES. If a topic matches nothing, or matches only
 * photos already used, the full pool comes back. A relevant photo is better
 * than an irrelevant one; no photo at all would be worse than both, and a
 * weekly post that silently stops going out is the kind of failure this file
 * has produced before.
 */
const TOPIC_MATCHERS: Array<{ when: RegExp; job: RegExp }> = [
  // Order matters: the first match wins, so put the specific before the broad.
  { when: /gutter|downspout|fascia|soffit/i, job: /gutter|fascia|soffit/i },
  { when: /\bmetal\b|standing seam|exposed fastener|panel/i, job: /metal/i },
  { when: /coating|silicone|tpo|epdm|pvc|low.slope|flat roof/i, job: /coating|silicone|tpo|epdm|pvc/i },
  { when: /storm|hail|wind damage|insurance|adjuster|claim/i, job: /storm|damage|hail|wind/i },
  { when: /shingle|granule|streak|algae|architectural|3.tab|decking|underlayment|ridge|flashing|valley/i, job: /shingle/i },
];

export function matchPhotosToTopic<T>(
  pool: T[],
  topic: string,
  jobKey: (p: T) => string,
): T[] {
  const rule = TOPIC_MATCHERS.find((m) => m.when.test(topic));
  if (!rule) return pool;
  const matched = pool.filter((p) => rule.job.test(jobKey(p)));
  return matched.length ? matched : pool;
}

/** Pick the next unused item, falling back to the least recently used. */
export function nextUnused<T>(
  all: T[],
  used: string[],
  key: (t: T) => string,
): {
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
 * Reorder a photo pool so consecutive posts come from DIFFERENT jobs.
 *
 * WHY. The rotation already guaranteed no photo repeats until the library is
 * exhausted, and the owner still saw the same roof week after week (flagged
 * 2026-10-06). Both things were true at once. nextUnused takes the first
 * unused entry, and the pool arrived grouped by project, so the rotation
 * walked a single job's photos end to end before moving on:
 *
 *   weeks 1-3   the Petal gutters job, three times
 *   weeks 4-5   one Hattiesburg roof, twice
 *   weeks 6-7   one Hattiesburg metal roof, twice
 *
 * Seven posts, three houses. "No photo repeats" was satisfied and the profile
 * still looked like it only had three jobs on it.
 *
 * WHAT THIS DOES. One photo from each job, then the next photo from each job,
 * and so on: a round robin instead of a walk. Thirteen jobs means the same
 * house cannot come back for thirteen weeks. Jobs contribute in a stable
 * order, so the sequence is still deterministic and auditable.
 *
 * The caller keeps using nextUnused on the result, so the no-repeat guarantee
 * and the recycling behaviour at the end are unchanged.
 */
export function roundRobinByJob<T>(
  photos: T[],
  jobKey: (p: T) => string,
  photoKey?: (p: T) => string,
  used: string[] = [],
): T[] {
  const byJob = new Map<string, T[]>();
  for (const p of photos) {
    const k = jobKey(p);
    const list = byJob.get(k);
    if (list) list.push(p);
    else byJob.set(k, [p]);
  }

  /*
   * JOBS GO IN LEAST-RECENTLY-SHOWN ORDER, which is a second, separate thing
   * from the round robin itself.
   *
   * The round robin alone stops the cron showing one job twice in a row. It
   * does not know what the profile has ALREADY shown, so after seven Updates
   * were replaced by hand the very next scheduled post would have been the
   * same Ocean Springs roof that had gone up an hour earlier: a different
   * photo of it, which is exactly the distinction the owner does not care
   * about and should not have to.
   *
   * Ranking by the most recent use of ANY of a job's photos puts the house
   * nobody has seen in months at the front and the one from this morning at
   * the back. Jobs never shown at all rank first, which is what you want from
   * a profile that is trying to look like it does a lot of work.
   */
  const recency = new Map(used.map((id, i) => [id, i]));
  const lastShown = (job: string): number =>
    Math.max(
      -1,
      ...(byJob.get(job) ?? []).map((p) =>
        photoKey ? (recency.get(photoKey(p)) ?? -1) : -1,
      ),
    );
  const queues = [...byJob.keys()]
    .sort((a, b) => lastShown(a) - lastShown(b))
    .map((k) => byJob.get(k)!);
  const out: T[] = [];
  for (let depth = 0; out.length < photos.length; depth++) {
    for (const q of queues) {
      if (depth < q.length) out.push(q[depth]);
    }
  }
  return out;
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
    return text.replace(
      new RegExp(`\\s*${String.fromCharCode(0x2014)}\\s*`, "g"),
      ", ",
    );
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
    doc ?? {
      _id: GBP_STATE_ID,
      _type: "gbpAuto",
      usedPhotoIds: [],
      usedTopics: [],
      postCount: 0,
    }
  );
}

/**
 * Mark a photo as spent WITHOUT consuming a copy slot, for photos the weekly
 * cron did not choose.
 *
 * WHY. Two different things post photos to the profile: this cron, and a job
 * upload. Only the cron recorded what it used, so the cron was free to pick a
 * photo a job post had already published. It did: the 24 August evergreen
 * Update went out with the identical image from the 8 July Petal gutters post,
 * byte for byte, confirmed by hashing both off Google's CDN.
 *
 * The rotation was never wrong about its own history. It just could not see
 * half of what the profile had already shown.
 */
export async function recordGbpPhotoUse(
  client: SanityClient,
  photoId: string | undefined,
): Promise<void> {
  if (!photoId) return;
  try {
    const state = await loadState(client);
    const used = state.usedPhotoIds ?? [];
    if (used.includes(photoId)) return;
    await client.createOrReplace({
      _id: GBP_STATE_ID,
      _type: "gbpAuto",
      usedPhotoIds: [...used, photoId].slice(-400),
      usedTopics: state.usedTopics ?? [],
      postCount: state.postCount ?? 0,
    });
  } catch {
    // Best effort. A missed record costs one possible repeat later, which is
    // not worth failing a post that has already gone out over.
  }
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
