import { getWriteClient } from "@/sanity/lib/client";
import { siteConfig } from "@/config/site";
import { planSocialPost } from "@/lib/social-plan";
import type { PhaseKey } from "@/config/job-taxonomy";

/**
 * Finish any social fan-out the browser didn't.
 *
 * WHY THIS EXISTS. /upload posts one platform per request, in sequence, from
 * the browser: facebook, then instagram, then google, then tiktok. That split
 * fixed the serverless timeout, but it moved the whole fan-out onto the tab
 * staying open and awake for all four round trips. On a phone that is a weak
 * assumption. Lock the screen, switch apps, or let iOS suspend the tab and the
 * loop simply stops wherever it was, with no error anywhere, because the
 * remaining requests are never sent.
 *
 * That is exactly what the log shows. Leakesville (2026-08-17) stopped after
 * Facebook; Purvis (2026-08-20) stopped after Instagram. Neither had error rows
 * for the missing platforms, because nothing ever reached the server to log.
 * Credentials were fine the whole time, and Google Business Profile posts in
 * about five seconds when it is actually called.
 *
 * So this sweeper runs server side and finishes the job. It only ever fills in
 * a platform with NO existing row, which means it cannot double-post: a job
 * already on Facebook keeps exactly one Facebook post.
 *
 * SCHEDULE: daily, NOT hourly. Vercel's Hobby plan caps cron jobs at once per
 * day and rejects the whole deployment when a schedule breaks that rule, so an
 * hourly entry here silently kills every deploy (it did, 2026-08-20). If the
 * account moves to Pro this can go back to hourly for faster recovery.
 *
 * It can also be run by hand from a phone with the /upload passphrase, for when
 * a checklist visibly stalls and waiting until tomorrow is not good enough.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PLATFORMS = ["facebook", "instagram", "google", "tiktok"] as const;
type Platform = (typeof PLATFORMS)[number];

/** A syndication row can be logged as "google-business" but posted as "google". */
const ROW_NAME: Record<Platform, string> = {
  facebook: "facebook",
  instagram: "instagram",
  google: "google-business",
  tiktok: "tiktok",
};

/** Only chase recent jobs. An old upload that was deliberately left off a
 *  platform should stay that way rather than surface weeks later. */
const WINDOW_DAYS = 7;

/** Stop starting new posts near the function ceiling so the run always returns
 *  a clean summary instead of being killed mid-post. */
const BUDGET_MS = 40_000;

interface ProjectRow {
  _id: string;
  slug?: string;
  socialCaption?: string;
  media?: Array<{ phase?: string; assetId?: string }>;
  syndication?: Array<{ platform?: string; status?: string }>;
}

/**
 * Two callers, two credentials: Vercel Cron sends CRON_SECRET as a Bearer
 * token, and the owner can trigger a run by hand with the same Basic auth
 * passphrase the /upload page uses.
 */
function authorized(request: Request): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth === `Bearer ${secret}`) return true;
  if (auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const pass = process.env.UPLOAD_PASSWORD || "roofroof";
      const [user, given] = decoded.split(":");
      if (given === pass || user === pass) return true;
    } catch {
      // fall through to unauthorized
    }
  }
  // With no secret configured at all, Vercel Cron still has to get in.
  return !secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dry") === "1";

  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000).toISOString();
  const projects = (await getWriteClient().fetch(
    `*[_type == "project" && _createdAt > $since] | order(_createdAt desc){
       _id,
       "slug": slug.current,
       socialCaption,
       "media": media[]{ phase, "assetId": image.asset._ref },
       "syndication": syndication[]{ platform, status }
     }`,
    { since },
  )) as ProjectRow[];

  const started = Date.now();
  const actions: Array<Record<string, unknown>> = [];

  for (const p of projects) {
    const rows = p.syndication ?? [];
    const missing = PLATFORMS.filter(
      (k) => !rows.some((r) => r.platform === ROW_NAME[k]),
    );
    if (!missing.length) continue;

    const PHASES: PhaseKey[] = ["before", "progress", "after"];
    const media = (p.media ?? []).filter(
      (m): m is { phase: PhaseKey; assetId: string } =>
        Boolean(m.assetId) && PHASES.includes(m.phase as PhaseKey),
    );
    if (!media.length || !p.socialCaption || !p.slug) {
      actions.push({ id: p._id, slug: p.slug, skipped: "incomplete project" });
      continue;
    }

    // Rebuild the same running order the confirm screen used. The hero picker
    // is deliberately skipped here: it costs a vision call and the plan's own
    // default (first finished photo) is a fine lead for a recovery post.
    const plan = planSocialPost(media, 0);
    const order = plan.order.map((m) => ({ assetId: m.assetId }));
    if (!order.length) {
      actions.push({ id: p._id, slug: p.slug, skipped: "no postable photos" });
      continue;
    }

    for (const platform of missing) {
      if (Date.now() - started > BUDGET_MS) {
        actions.push({ id: p._id, platform, skipped: "out of time this run" });
        continue;
      }
      if (dryRun) {
        actions.push({ id: p._id, slug: p.slug, platform, wouldPost: true });
        continue;
      }
      const result = await postPlatform({
        id: p._id,
        slug: p.slug,
        platform,
        caption: p.socialCaption,
        order,
        heroAssetId: plan.hero?.assetId,
      });
      actions.push({ id: p._id, slug: p.slug, platform, ...result });
    }
  }

  return Response.json({
    ok: true,
    dryRun,
    scanned: projects.length,
    actions,
  });
}

/**
 * Post one platform through the existing /upload?step=social handler rather
 * than reimplementing it. That keeps a single code path for the actual posting
 * and, importantly, a single code path for writing the syndication log row.
 * The route sits behind the Basic auth gate in proxy.ts, so send the same
 * passphrase the /upload page uses.
 */
async function postPlatform(body: {
  id: string;
  slug: string;
  platform: Platform;
  caption: string;
  order: Array<{ assetId: string }>;
  heroAssetId?: string;
}): Promise<Record<string, unknown>> {
  const pass = process.env.UPLOAD_PASSWORD || "roofroof";
  try {
    const res = await fetch(`${siteConfig.url}/api/upload?step=social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Basic ${Buffer.from(`:${pass}`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as Record<string, unknown>;
    return { status: data.status ?? `http ${res.status}`, note: data.note };
  } catch (err) {
    return { status: "error", note: err instanceof Error ? err.message : "failed" };
  }
}
