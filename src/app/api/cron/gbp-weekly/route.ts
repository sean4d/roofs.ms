import { getWriteClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/config/site";
import { gbpReady, createGbpUpdate } from "@/lib/gbp";

/**
 * Weekly Google Business Profile "Update" — keeps the profile active between
 * job uploads (an active profile ranks better and reads as a real, working
 * business). Triggered by Vercel Cron (see vercel.json). Posts one rotating
 * evergreen message with the latest finished-job photo and a "Learn more"
 * button to the free-inspection page.
 *
 * Auth: when CRON_SECRET is set, Vercel Cron sends it as a Bearer token and we
 * require it; with no secret set it runs unauthenticated (fine to start, but
 * set CRON_SECRET in Vercel to lock it down). No-op until GBP is connected.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** Rotating, evergreen messages (no dated claims) suited to South Mississippi. */
const MESSAGES = [
  "Roof been through a few Mississippi summers? A free inspection tells you honestly whether you need a repair, a replacement, or nothing yet — with photos to back it up. No pressure, no obligation.",
  "Storm season is a fact of life here. The best time to check your roof is before the next system — we document everything so you're covered if a claim ever comes. Book a free inspection anytime.",
  "Thinking about metal vs. shingle? We install both across South Mississippi and will quote them side by side from one free inspection — so you decide with real numbers, not averages off the internet.",
  "Every roof we build is priced line by line — shingle, underlayment, flashing, disposal — so you see exactly what you're paying for. Nothing pre-checked, no surprises. Ask us for an itemized proposal.",
  "Licensed (MSBOC #R22245), GAF-certified, BBB A-rated, and 5-star reviewed on Google — and still here after the storm-chasers leave. Get a free, no-obligation roof inspection from a local crew.",
  "Missing shingles, a ceiling stain, or granules in the gutter? Those small signs are cheapest to fix early. Send us a photo or book a free inspection and we'll tell you straight what's going on.",
];

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  if (!gbpReady()) {
    return Response.json({ ok: false, note: "GBP not connected — skipped" });
  }

  // Rotate the message by ISO week so consecutive weeks differ.
  const week = Math.floor(Date.now() / (7 * 86_400_000));
  const summary = MESSAGES[week % MESSAGES.length];

  // Pair it with the most recent finished-job photo, if we have one.
  let imageUrl: string | undefined;
  try {
    const doc = (await getWriteClient().fetch(
      `*[_type == "project"] | order(_createdAt desc)[0]{ media }`,
    )) as { media?: Array<{ phase?: string; image?: { asset?: { _ref?: string } } }> } | null;
    const media = doc?.media ?? [];
    const ref =
      media.find((m) => m.phase === "after")?.image?.asset?._ref ??
      media[0]?.image?.asset?._ref;
    if (ref) {
      imageUrl = urlFor({ _type: "image", asset: { _type: "reference", _ref: ref } })
        .width(1200)
        .format("jpg")
        .url();
    }
  } catch {
    // Photo is optional — post text-only if the fetch fails.
  }

  const result = await createGbpUpdate({
    summary,
    imageUrl,
    learnMoreUrl: `${siteConfig.url}/free-inspection`,
  });

  return Response.json({ ok: result.status !== "error", result });
}
