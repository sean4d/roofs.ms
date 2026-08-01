import { analyzeDamage, type DamageInput } from "@/lib/ai/damage-analyzer";

export const runtime = "nodejs";
// Vision analysis can take a few seconds; give it headroom.
export const maxDuration = 30;

/** Cap photos server-side so payload + Claude cost stay bounded. */
const MAX_IMAGES = 4;

/**
 * Damage Analyzer endpoint, thin wrapper over the provider-abstracted analysis
 * layer. The provider (Claude vision or the deterministic mock) is chosen
 * inside lib/ai/damage-analyzer.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DamageInput;
    if (!body?.issue) {
      return Response.json({ error: "Missing issue" }, { status: 400 });
    }
    if (Array.isArray(body.images)) {
      body.images = body.images
        .filter((i) => i && typeof i.data === "string")
        .slice(0, MAX_IMAGES);
    }
    return Response.json(await analyzeDamage(body));
  } catch {
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
