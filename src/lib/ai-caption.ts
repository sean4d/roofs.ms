import { getJobType } from "@/config/job-taxonomy";
import { siteConfig } from "@/config/site";
import type { JobSubmission } from "@/lib/job-content";
import { stripEmDashes } from "@/lib/no-em-dash";

/**
 * AI caption polish. Turns the owner's rough job notes + the structured
 * selections into a clean, professional social caption body, instead of
 * posting the raw notes verbatim. Uses Claude (Haiku, fast + cheap) when
 * ANTHROPIC_API_KEY is set; returns null otherwise so callers fall back to the
 * deterministic template. Never invents facts: it only polishes what's given.
 */

const MODEL = "claude-haiku-4-5-20251001";

/**
 * EIGHT ANGLES, BECAUSE ONE PROMPT WRITES ONE CAPTION.
 *
 * The prompt used to say "write a warm, professional caption about this
 * completed job" and nothing else, so every post opened the same way: "We
 * recently completed a beautiful shingle roof replacement in Perkinston, MS."
 * That is not the model being lazy, it is the model being consistent. Ask the
 * same question the same way and you get the same answer, and the owner ended
 * up with a feed of posts that read as machine-written because they were all
 * built to one shape.
 *
 * Telling a writer to "be varied" does not work. Telling it what this
 * particular caption is ABOUT does. Each angle changes the subject of the
 * first sentence, not its wording, so two posts differ in substance rather
 * than in synonyms for "we finished a roof".
 *
 * The angle is chosen from the job itself, so it is stable if the caption is
 * regenerated and different from job to job.
 */
export const ANGLES = [
  "Open on the property itself: what kind of building it is and where it sits. Reach the roof in the second sentence.",
  "Open on the condition the roof was in before this work, then what was done about it.",
  "Open on one specific material or product decision and why it suits this building and this climate.",
  "Open on the work itself: the crew, the day, what the job actually took to do properly.",
  "Open on what this owner has now that they did not have before, how the roof performs rather than how it looks.",
  "Open on the weather a roof has to live through in South Mississippi, then the roof that will take it.",
  "State the facts flat in the first sentence, with no wind-up and no adjectives at all. Let the second and third sentences do the warmth.",
  "Open on a specific detail a reader can see in the photographs, and let that detail carry the post.",
];

/**
 * A stable number from the job, so the same submission always draws the same
 * angle and two different jobs almost never draw the same one. FNV-1a, which
 * is short, has no dependencies, and spreads small string changes well.
 */
export function angleFor(seed: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ANGLES[Math.abs(h) % ANGLES.length];
}

/**
 * @param photoBrief one line describing what the carousel actually contains
 *   (see lib/social-plan captionBrief). Without it the writer is blind to the
 *   photos and will happily write "another quality roof installed" over a stack
 *   of plywood decking, which is exactly what happened on 2026-07-31.
 */
export async function polishCaption(
  sub: JobSubmission,
  photoBrief?: string,
): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const jt = getJobType(sub.jobType);
  const facts = [
    `Company: ${siteConfig.name}, a licensed roofing contractor in Hattiesburg, Mississippi.`,
    `Job: ${jt?.label ?? sub.jobType} (${sub.channel}).`,
    sub.city ? `Location: ${sub.city}, Mississippi.` : "",
    ...Object.entries(sub.details ?? {}).map(
      ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`,
    ),
    sub.description ? `Owner's rough notes: "${sub.description}"` : "",
    photoBrief ? `What the photos in this post show: ${photoBrief}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const angle = angleFor(
    [sub.city, sub.jobType, sub.channel, sub.description, photoBrief]
      .filter(Boolean)
      .join("|"),
  );

  const prompt =
    `You write social captions for a Mississippi roofing company. Using ONLY the ` +
    `facts below, write a warm, professional caption body of 2-3 short sentences ` +
    `about this completed job. Polish the owner's rough notes into clean prose, ` +
    `never quote them verbatim. Do NOT invent numbers, warranties, prices, or ` +
    `claims not present. No hashtags and no emojis (added separately).\n\n` +
    `THE ANGLE FOR THIS POST: ${angle}\n\n` +
    `OPENINGS THAT ARE BANNED. Do not begin with any version of the company ` +
    `announcing that it did a job: "We recently completed", "We just finished", ` +
    `"We wrapped up", "Another ... done right", "Proud to share", "Check out", ` +
    `"Take a look", "Swipe to see". Do not begin with the company name. Do not ` +
    `use the words beautiful, stunning or gorgeous anywhere. These posts sit ` +
    `next to each other in a feed, so two in a row that open alike read as ` +
    `machine-written even when each one is fine on its own.\n\n` +
    `CRITICAL: the caption must match the photos described below. Never describe ` +
    `something the reader cannot see. If the post ends on an in-progress photo ` +
    `(decking, underlayment, tear-off), earn it, make the work itself the point ` +
    `rather than letting it look like a mistake. Never use an em dash; use a ` +
    `comma, a full stop, or a colon instead. Return ONLY the caption text.` +
    `\n\n${facts}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data.content?.[0]?.text?.trim();
    // The prompt asks for no em dashes, but a caption is written once and then
    // lives on /projects and every social platform forever, so don't leave it
    // to the model's word. Belt and braces.
    return text && text.length > 0 ? stripEmDashes(text) : null;
  } catch {
    return null;
  }
}
