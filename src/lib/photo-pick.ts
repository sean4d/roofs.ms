/**
 * Picks which finished-roof photo leads. Single-image surfaces — the Google
 * Business Profile update, the map pin, the gallery card — show exactly one
 * photo, so "whichever happened to upload first" is not good enough.
 *
 * Claude looks at the candidates and picks the one that actually sells: full
 * roof in frame, clean light, no ladder or truck or half a neighbour's house.
 * Best-effort by design — any failure falls back to the first photo, because a
 * post going out with a merely-fine cover beats a post not going out.
 */

const MODEL = "claude-haiku-4-5-20251001";

/** Never ship more than this to the picker — cost and latency, not capability. */
const MAX_CANDIDATES = 8;

export interface HeroPick {
  index: number;
  /** Why this one — surfaced on the confirm screen so the choice is arguable. */
  note?: string;
}

/**
 * @param imageUrls public JPEG URLs of the AFTER photos, in upload order
 * @returns index into imageUrls (always valid, even on failure)
 */
export async function pickHeroPhoto(imageUrls: string[]): Promise<HeroPick> {
  if (imageUrls.length <= 1) return { index: 0 };
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { index: 0, note: "First finished photo (no AI key set)" };

  const candidates = imageUrls.slice(0, MAX_CANDIDATES);

  const content: Array<Record<string, unknown>> = [];
  candidates.forEach((url, i) => {
    content.push({ type: "text", text: `Photo ${i + 1}:` });
    content.push({ type: "image", source: { type: "url", url } });
  });
  content.push({
    type: "text",
    text:
      `These are finished-roof photos from one roofing job. Pick the single ` +
      `best one to be the cover image of a Google Business Profile post — the ` +
      `only photo most people will ever see.\n\n` +
      `Favour: the roof filling the frame, clean even light, a flattering ` +
      `angle showing the roof planes, the whole house looking cared for.\n` +
      `Avoid: ladders, trucks, tools, workers, debris, heavy shadow, blown-out ` +
      `sky, blurry or crooked framing, a neighbouring house dominating, and ` +
      `close-ups too tight to read as a roof.\n\n` +
      `Reply with ONLY a JSON object: {"photo": <number>, "why": "<8 words max>"}`,
  });

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
        max_tokens: 100,
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) return { index: 0, note: "First finished photo" };
    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { index: 0, note: "First finished photo" };
    const parsed = JSON.parse(match[0]) as { photo?: number; why?: string };
    const oneBased = Number(parsed.photo);
    if (!Number.isFinite(oneBased)) return { index: 0, note: "First finished photo" };
    // Clamp rather than trust: a hallucinated index must not drop the cover.
    const index = Math.min(Math.max(Math.round(oneBased) - 1, 0), candidates.length - 1);
    return { index, note: parsed.why?.trim() || undefined };
  } catch {
    return { index: 0, note: "First finished photo" };
  }
}
