import { getJobType } from "@/config/job-taxonomy";
import { siteConfig } from "@/config/site";
import type { JobSubmission } from "@/lib/job-content";

/**
 * AI caption polish. Turns the owner's rough job notes + the structured
 * selections into a clean, professional social caption body — instead of
 * posting the raw notes verbatim. Uses Claude (Haiku, fast + cheap) when
 * ANTHROPIC_API_KEY is set; returns null otherwise so callers fall back to the
 * deterministic template. Never invents facts — it only polishes what's given.
 */

const MODEL = "claude-haiku-4-5-20251001";

export async function polishCaption(sub: JobSubmission): Promise<string | null> {
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
  ]
    .filter(Boolean)
    .join("\n");

  const prompt =
    `You write social captions for a Mississippi roofing company. Using ONLY the ` +
    `facts below, write a warm, professional caption body of 2-3 short sentences ` +
    `about this completed job. Polish the owner's rough notes into clean prose — ` +
    `never quote them verbatim. Do NOT invent numbers, warranties, prices, or ` +
    `claims not present. No hashtags and no emojis (added separately). Return ONLY ` +
    `the caption text.\n\n${facts}`;

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
    return text && text.length > 0 ? text : null;
  } catch {
    return null;
  }
}
