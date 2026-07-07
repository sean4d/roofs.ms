import { analyzeDamage, type DamageInput } from "@/lib/ai/damage-analyzer";

export const runtime = "nodejs";

/**
 * Damage Analyzer endpoint — thin wrapper over the provider-abstracted analysis
 * layer. When a vision model is connected, only lib/ai/damage-analyzer changes.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DamageInput;
    if (!body?.issue) {
      return Response.json({ error: "Missing issue" }, { status: 400 });
    }
    return Response.json(await analyzeDamage(body));
  } catch {
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
