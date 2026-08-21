import { getWriteClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/config/site";
import { gbpReady, createGbpUpdate } from "@/lib/gbp";
import {
  EVERGREEN,
  TOPICS,
  generateUpdate,
  loadState,
  nextUnused,
  saveState,
} from "@/lib/gbp-content";

/**
 * Weekly Google Business Profile Update. An active profile ranks better and
 * reads as a real, working business, so this keeps something going out between
 * job uploads. Triggered by Vercel Cron (see vercel.json).
 *
 * Rewritten 2026-08-21. The first version always took the newest project and
 * its first finished photo, so any week without a new upload reposted the same
 * image: three consecutive Updates on the profile looked identical. Now the
 * photo rotates across every project we have and does not repeat until the
 * whole library has been used, and the copy runs the evergreen set first then
 * switches to AI-written industry updates so it never runs dry.
 *
 * Auth: Vercel Cron sends CRON_SECRET as a Bearer token. The /upload passphrase
 * is also accepted over Basic auth, so the rotation can be inspected by hand
 * with ?dry=1 before a week's post actually goes out. No-op until GBP is
 * connected.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface PhotoRow {
  assetId: string;
  slug?: string;
  phase?: string;
}

/** Vercel Cron's Bearer token, or the same passphrase the /upload page uses. */
function authorized(request: Request): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth === `Bearer ${secret}`) return true;
  if (auth.startsWith("Basic ")) {
    try {
      const [user, given] = atob(auth.slice(6)).split(":");
      const pass = process.env.UPLOAD_PASSWORD || "roofroof";
      if (given === pass || user === pass) return true;
    } catch {
      // fall through
    }
  }
  return !secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dry") === "1";

  if (!gbpReady() && !dryRun) {
    return Response.json({ ok: false, note: "GBP not connected, skipped" });
  }

  const client = getWriteClient();
  const state = await loadState(client);

  // ── Photo: every finished shot we have, oldest project first ──────────────
  // Finished work only. A "before" or a mid-tear-off photo is the wrong thing
  // to lead a business profile with.
  let photos: PhotoRow[] = [];
  try {
    photos = (await client.fetch(
      `*[_type == "project" && defined(media)] | order(_createdAt asc){
         "slug": slug.current,
         "media": media[]{ phase, "assetId": image.asset._ref }
       }[].media[]{ ..., "slug": ^.slug }`,
    )) as PhotoRow[];
  } catch {
    photos = [];
  }
  const finished = photos.filter((p) => p?.assetId && p.phase === "after");
  const pool = finished.length ? finished : photos.filter((p) => p?.assetId);

  let imageUrl: string | undefined;
  let photoId: string | undefined;
  let photoCycled = false;
  if (pool.length) {
    const picked = nextUnused(pool, state.usedPhotoIds ?? [], (p) => p.assetId);
    photoCycled = picked.exhausted;
    photoId = picked.item.assetId;
    imageUrl = urlFor({
      _type: "image",
      asset: { _type: "reference", _ref: photoId },
    })
      .width(1200)
      .format("jpg")
      .url();
  }

  // ── Copy: evergreen set first, then AI industry updates ───────────────────
  const usedTopics = state.usedTopics ?? [];
  const evergreenKeys = EVERGREEN.map((_, i) => `evergreen:${i}`);
  const unusedEvergreen = evergreenKeys.filter((k) => !usedTopics.includes(k));

  let summary: string;
  let topicKey: string;
  let source: "evergreen" | "ai";

  if (unusedEvergreen.length) {
    topicKey = unusedEvergreen[0];
    summary = EVERGREEN[Number(topicKey.split(":")[1])];
    source = "evergreen";
  } else {
    const picked = nextUnused(
      TOPICS.map((t) => ({ t })),
      usedTopics.map((k) => k.replace(/^ai:/, "")),
      (x) => x.t,
    );
    const topic = picked.item.t;
    topicKey = `ai:${topic}`;
    const written = await generateUpdate(topic);
    if (written) {
      summary = written;
      source = "ai";
    } else {
      // No API key or the model failed: fall back to the evergreen message
      // used longest ago rather than skipping the week entirely.
      const idx = (state.postCount ?? 0) % EVERGREEN.length;
      summary = EVERGREEN[idx];
      topicKey = `evergreen:${idx}`;
      source = "evergreen";
    }
  }

  if (dryRun) {
    return Response.json({
      ok: true,
      dryRun: true,
      source,
      topicKey,
      summary,
      photoId,
      imageUrl,
      photoCycled,
      poolSize: pool.length,
      alreadyUsedPhotos: (state.usedPhotoIds ?? []).length,
      postCount: state.postCount ?? 0,
    });
  }

  const result = await createGbpUpdate({
    summary,
    imageUrl,
    learnMoreUrl: `${siteConfig.url}/free-inspection`,
  });

  // Only burn the photo and topic if the post actually landed, so a failed
  // week does not silently consume the next item in the rotation.
  if (result.status === "posted") {
    await saveState(client, state, photoId, topicKey);
  }

  return Response.json({
    ok: result.status !== "error",
    source,
    topicKey,
    photoId,
    photoCycled,
    poolSize: pool.length,
    result,
  });
}
