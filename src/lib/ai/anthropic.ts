/**
 * Minimal Anthropic (Claude) client for the site's analysis tools. Kept tiny
 * and dependency-free (raw fetch) to match ai-caption.ts. Everything fails
 * soft, if ANTHROPIC_API_KEY is missing or anything goes wrong, callers get
 * null and fall back to their deterministic templates. The tools never break.
 *
 * Structured output is guaranteed via a single forced tool call: we hand Claude
 * one tool whose input_schema is the exact JSON shape we want back, force it
 * with tool_choice, and read the tool_use block. No brittle prose parsing.
 *
 * Model is env-overridable (ANTHROPIC_MODEL). Default is Haiku 4.5. It has
 * vision, is fast, and is cheap enough to run on public traffic (fractions of a
 * cent per call). Bump to a Sonnet/Opus id in Vercel env for richer reads with
 * zero code changes.
 */

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";

/** A resized JPEG the browser sent us, base64 with no data: prefix. */
export interface InlineImage {
  /** base64-encoded JPEG bytes (no "data:image/jpeg;base64," prefix) */
  data: string;
}

interface CallOptions {
  system: string;
  user: string;
  images?: InlineImage[];
  /** JSON Schema for the object we want back (object type). */
  schema: Record<string, unknown>;
  maxTokens?: number;
}

type ContentBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      source: { type: "base64"; media_type: "image/jpeg"; data: string };
    };

/**
 * Call Claude and return a validated structured object, or null on any failure.
 * The schema is enforced by a forced tool call, so a non-null result already
 * matches the shape the caller asked for.
 */
export async function structuredClaude<T>(opts: CallOptions): Promise<T | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const content: ContentBlock[] = [];
  for (const img of opts.images ?? []) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: img.data },
    });
  }
  content.push({ type: "text", text: opts.user });

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
        max_tokens: opts.maxTokens ?? 700,
        system: opts.system,
        tools: [
          {
            name: "report",
            description: "Return the analysis in the required structure.",
            input_schema: opts.schema,
          },
        ],
        tool_choice: { type: "tool", name: "report" },
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: Array<{ type: string; name?: string; input?: unknown }>;
    };
    const tool = data.content?.find(
      (b) => b.type === "tool_use" && b.name === "report",
    );
    return (tool?.input as T) ?? null;
  } catch {
    return null;
  }
}
