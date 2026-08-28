import { randomUUID } from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";

import { getWriteClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { getJobType, type PhaseKey } from "@/config/job-taxonomy";
import { siteConfig } from "@/config/site";
import {
  assembleCaption,
  deterministicBody,
  jobSummary,
  jobTags,
  jobTitle,
  photoSeo,
  slugify,
  type JobSubmission,
} from "@/lib/job-content";
import { polishCaption } from "@/lib/ai-caption";
import { diagnoseMeta, postToMeta } from "@/lib/syndicate";
import {
  planSocialPost,
  captionBrief,
  type SocialPlan,
} from "@/lib/social-plan";
import { pickHeroPhoto } from "@/lib/photo-pick";
import {
  postViaMetricool,
  inspectMetricool,
  listMetricoolPosts,
  deleteMetricoolPosts,
  postGbpPhoto,
  metricoolGalleryEnabled,
  type GbpPhotoResult,
} from "@/lib/metricool";
import { diagnoseReviews } from "@/lib/google-reviews";
import { buildSlideshow } from "@/lib/slideshow";
import { submitToIndexNow } from "@/lib/indexnow";
import {
  sendReviewRequestEmail,
  reviewRequestLinks,
} from "@/lib/review-request";
import sitemap from "@/app/sitemap";
import {
  gbpConfigured,
  gbpReady,
  discoverGbp,
  authConsentUrl,
  exchangeAuthCode,
  postJobToGbp,
  uploadGbpPhotos,
  createGbpUpdate,
  listGbpPosts,
  deleteGbpPost,
} from "@/lib/gbp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Building the TikTok slideshow (download + sharp frames + ffmpeg encode) plus
// the social fan-out needs more than the default budget.
export const maxDuration = 60;

/**
 * Build the TikTok slideshow MP4 from the job's social photos and upload it to
 * Sanity as a public file, returning its CDN URL (or undefined on any failure,
 * TikTok then simply skips). Kept here (not in metricool.ts) because it needs
 * the Sanity client to host the video.
 */
async function tiktokVideoUrl(
  imageUrls: string[],
  client: ReturnType<typeof getWriteClient>,
): Promise<string | undefined> {
  try {
    const mp4 = await buildSlideshow(imageUrls);
    if (!mp4) return undefined;
    const asset = await client.assets.upload("file", mp4, {
      filename: `tiktok-slideshow-${Date.now()}.mp4`,
      contentType: "video/mp4",
    });
    return asset.url;
  } catch {
    return undefined;
  }
}

/** Install-timeline order so social carousels read before -> during -> after. */
const PHASE_RANK: Record<string, number> = { before: 0, progress: 1, after: 2 };

function jpgUrl(assetId: string): string {
  return urlFor({
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
  })
    .width(1200)
    .format("jpg")
    .url();
}

/*
 * Photos go to social EXACTLY as shot. The old code burned BEFORE/DURING/AFTER
 * badges into before/after posts; the owner killed that on 2026-08-01. It
 * looks tacky, customers can tell a before photo without being told, and the
 * caption is where the explaining belongs. The re-encode pass it required
 * (download → sharp → re-upload, per photo) was also pure latency in a request
 * that was already timing out.
 */

/**
 * Upload steps, each its own request so none of them can starve the others:
 *   ?step=asset: one photo → Sanity, returns its SEO
 *   ?step=plan, decide the post + write the caption, publishing nothing
 *   ?step=create: publish the job to the website, return immediately
 *   ?step=social, post ONE platform, log the outcome
 * The whole route sits behind the password gate in proxy.ts.
 */
/**
 * Read-only diagnostics. GET so it can be opened straight from a phone browser
 * (behind the same passphrase as the rest of /api/upload), every other step
 * mutates something and stays POST-only.
 */
/**
 * Which deployment is serving right now. The /upload page compares this at
 * submit time against what it saw on load, if they differ, the tab is running
 * JavaScript from an older build and must reload before posting.
 *
 * This is not theoretical. On 2026-08-01 a tab left open from before a deploy
 * submitted a job using the previous bundle, which posts straight to
 * step=create and knows nothing about the confirm screen or step=social. The
 * server published the job correctly, so it looked like a success, but no
 * platform was ever contacted and the owner never saw the checklist.
 */
function deploymentId(): string {
  return (
    process.env.VERCEL_DEPLOYMENT_ID ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    "dev"
  );
}

export async function GET(request: Request) {
  const step = new URL(request.url).searchParams.get("step");
  if (step === "version") {
    return Response.json(
      { id: deploymentId() },
      { headers: { "cache-control": "no-store" } },
    );
  }
  if (step === "check") {
    try {
      return await handleCheck();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Check failed";
      return Response.json({ error: message }, { status: 500 });
    }
  }
  return Response.json(
    { error: "GET supports ?step=check and ?step=version only" },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  const step = new URL(request.url).searchParams.get("step");
  try {
    if (step === "asset") return await handleAsset(request);
    if (step === "plan") return await handlePlan(request);
    if (step === "create") return await handleCreate(request);
    if (step === "social") return await handleSocial(request);
    if (step === "delete") return await handleDelete(request);
    if (step === "dedash") return await handleDedash(request);
    if (step === "metricool") return await handleMetricool(request);
    if (step === "metricool-clean") return await handleMetricoolClean(request);
    if (step === "gbp-photo") return await handleGbpPhoto(request);
    if (step === "gbp-posts") return await handleGbpPosts();
    if (step === "gbp-delete") return await handleGbpDelete(request);
    if (step === "gbp") return await handleGbp(request);
    if (step === "gbp-auth") return await handleGbpAuth(request);
    if (step === "gbp-backfill") return await handleGbpBackfill(request);
    if (step === "check") return await handleCheck();
    if (step === "indexnow") return await handleIndexNow();
    if (step === "revalidate") return handleRevalidate();
    return Response.json({ error: "Unknown step" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * One-off maintenance: strip em dashes from project documents already stored in
 * Sanity (owner directive 2026-08-01, no em dashes anywhere on the site). The
 * source code was swept in the same change, but titles and captions written by
 * earlier uploads live in the CMS and render on /projects regardless.
 *
 * Titles get " (City, MS)" in place of the dash, matching what jobTitle now
 * generates; everything else takes a comma. DRY RUN unless { confirm: true }.
 *
 * The dash is built from its code point on purpose. A literal one here would be
 * caught by the very site-wide sweep this function exists to finish, which is
 * exactly what happened the first time: the patterns below were rewritten into
 * commas and colons, and the endpoint reported "0 changes" while doing nothing.
 */
const EM_DASH = String.fromCharCode(0x2014);

async function handleDedash(request: Request) {
  const { confirm } = (await request.json().catch(() => ({}))) as {
    confirm?: boolean;
  };
  const client = getWriteClient();
  const glob = `*${EM_DASH}*`;
  const docs = (await client.fetch(
    `*[_type == "project" && (title match $glob || summary match $glob || description match $glob || socialCaption match $glob)]{_id,title,summary,description,socialCaption}`,
    { glob },
  )) as Array<Record<string, string>>;

  const spaced = new RegExp(`\\s*${EM_DASH}\\s*`, "g");
  const trailing = new RegExp(`^(.*?)\\s*${EM_DASH}\\s*(.+)$`);

  const fix = (s: string | undefined, isTitle: boolean) => {
    if (!s || !s.includes(EM_DASH)) return s;
    if (isTitle) {
      const m = s.match(trailing);
      if (m) return `${m[1]} (${m[2]})`;
    }
    return s.replace(spaced, ", ");
  };

  const changes = docs.map((d) => ({
    _id: d._id,
    before: d.title,
    after: fix(d.title, true),
  }));

  if (confirm) {
    for (const d of docs) {
      const patch: Record<string, string> = {};
      for (const [k, isTitle] of [
        ["title", true],
        ["summary", false],
        ["description", false],
        ["socialCaption", false],
      ] as const) {
        const next = fix(d[k], isTitle);
        if (next && next !== d[k]) patch[k] = next;
      }
      if (Object.keys(patch).length)
        await client.patch(d._id).set(patch).commit();
    }
    revalidateTag("projects", "max");
    revalidatePath("/projects");
    revalidatePath("/project-map");
  }

  return Response.json({
    dryRun: !confirm,
    documents: docs.length,
    changes,
  });
}

/**
 * List the profile's Updates so a bad or repeated post can be found and
 * removed. Read-only.
 */
async function handleGbpPosts() {
  const posts = await listGbpPosts(30);
  return Response.json({
    count: posts.length,
    posts: posts.map((p) => ({
      name: p.name,
      createTime: p.createTime,
      summary: (p.summary ?? "").slice(0, 90),
      photos: p.mediaUrls.length,
    })),
  });
}

/**
 * Delete one Update by resource name.
 *
 * Google does not allow the photo on a live post to be changed: localPosts
 * accepts media only at create time. Replacing an image therefore means
 * deleting the post and publishing a new one.
 */
async function handleGbpDelete(request: Request) {
  const { name } = (await request.json()) as { name?: string };
  if (!name) return Response.json({ error: "name required" }, { status: 400 });
  return Response.json(await deleteGbpPost(name));
}

/** Delete a project by id (password-gated via proxy). For removing a bad or
 *  test upload. Leaves image assets unreferenced (harmless). */
async function handleDelete(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) return Response.json({ error: "No id provided" }, { status: 400 });
  const client = getWriteClient();

  // Read the slug BEFORE deleting: the project's own page was pre-rendered by
  // generateStaticParams, so without revalidating that exact path it keeps
  // serving a 200 for a job that no longer exists (seen 2026-08-01 after
  // removing a duplicate).
  let slug: string | undefined;
  try {
    const doc = (await client.getDocument(id)) as ProjectDoc | undefined;
    slug = doc?.slug?.current;
  } catch {
    // Deleting matters more than tidying its page; carry on.
  }

  await client.delete(id);
  revalidateTag("projects", "max");
  revalidatePath("/projects");
  revalidatePath("/project-map");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/sitemap.xml");
  return Response.json({ ok: true, deleted: id, slug });
}

/**
 * Diagnostic (password-gated): reports whether live Google reviews and the
 * Metricool credentials are actually working in THIS environment. Never leaks
 * secret values, only presence booleans + upstream status/messages.
 */
async function handleCheck() {
  const reviews = await diagnoseReviews();
  const metricool = {
    tokenPresent: Boolean(process.env.METRICOOL_API_TOKEN),
    userIdPresent: Boolean(process.env.METRICOOL_USER_ID),
    blogIdPresent: Boolean(process.env.METRICOOL_BLOG_ID),
    // Auto GBP-gallery fan-out only fires once this is switched on (after the
    // step=gbp-photo test confirms the flag). Off by default.
    galleryAutoPost: metricoolGalleryEnabled(),
  };
  const anthropicKeyPresent = Boolean(process.env.ANTHROPIC_API_KEY);
  const metricoolPosts = await inspectMetricool();
  // Official Google Business Profile API, Tier 1. Presence booleans only,
  // never the secret values. `ready` means uploads auto-post to GBP.
  const gbp = {
    clientIdPresent: Boolean(process.env.GBP_CLIENT_ID),
    clientSecretPresent: Boolean(process.env.GBP_CLIENT_SECRET),
    refreshTokenPresent: Boolean(process.env.GBP_REFRESH_TOKEN),
    accountIdPresent: Boolean(process.env.GBP_ACCOUNT_ID),
    locationIdPresent: Boolean(process.env.GBP_LOCATION_ID),
    // OAuth creds set (can discover ids / do the one-time auth):
    configured: gbpConfigured(),
    // Fully wired, every upload now auto-posts to GBP:
    autoPost: gbpReady(),
  };
  // Facebook + Instagram. Presence booleans plus live read-only probes, because
  // "token expired" and "variable never set" produce the same silent skip.
  const meta = await diagnoseMeta();
  return Response.json({
    reviews,
    meta,
    metricool,
    anthropicKeyPresent,
    metricoolPosts,
    gbp,
  });
}

/**
 * Cleanup for the runaway-loop incident: delete Metricool posts on the given
 * networks + statuses. Defaults to a DRY RUN listing what WOULD be deleted;
 * pass { confirm: true } to actually delete. Only touches gmb/tiktok by default
 * (the API-posted networks), never the owner's Facebook/Instagram posts.
 */
async function handleMetricoolClean(request: Request) {
  const {
    confirm = false,
    networks = ["gmb", "tiktok"],
    statuses = ["PENDING", "ERROR"],
  } = (await request.json().catch(() => ({}))) as {
    confirm?: boolean;
    networks?: string[];
    statuses?: string[];
  };

  const posts = await listMetricoolPosts();
  const targets = posts.filter((p) =>
    (p.providers ?? []).some(
      (pr) =>
        pr.network &&
        networks.includes(pr.network) &&
        pr.status &&
        statuses.includes(pr.status),
    ),
  );
  const ids = targets
    .map((p) => p.id)
    .filter((v): v is number => typeof v === "number");

  const byStatus: Record<string, number> = {};
  for (const p of targets)
    for (const pr of p.providers ?? [])
      if (pr.status)
        byStatus[`${pr.network}:${pr.status}`] =
          (byStatus[`${pr.network}:${pr.status}`] ?? 0) + 1;

  if (!confirm) {
    return Response.json({ dryRun: true, matched: ids.length, byStatus, ids });
  }
  const deleted = await deleteMetricoolPosts(ids);
  const okCount = deleted.filter((d) => d.ok).length;
  return Response.json({
    dryRun: false,
    attempted: ids.length,
    deleted: okCount,
    results: deleted,
  });
}

/**
 * Careful single-call test for the GBP Photos-gallery path (the task's
 * "figure out the flag + test one call at a time" step). Password-gated.
 *
 * Body (all optional):
 *   { imageUrl }: post this exact public image
 *   { id, index }, post one photo (default the first) from an existing
 *                         project, preferring an "after" photo
 *   { confirm: true }, actually send. WITHOUT it this is a DRY RUN that
 *                         returns the exact body that WOULD be sent, no network
 *                         call, so the flag is inspectable before anything goes
 *                         live. After a confirmed send, use step=check to read
 *                         the post back and verify it landed in the gallery.
 */
async function handleGbpPhoto(request: Request) {
  const {
    imageUrl,
    id,
    index = 0,
    confirm = false,
  } = (await request.json().catch(() => ({}))) as {
    imageUrl?: string;
    id?: string;
    index?: number;
    confirm?: boolean;
  };

  let target = imageUrl;
  if (!target && id) {
    const client = getWriteClient();
    const doc = (await client.getDocument(id)) as ProjectDoc | undefined;
    if (!doc)
      return Response.json({ error: "Project not found" }, { status: 404 });
    const assetIds = (doc.media ?? [])
      .slice()
      // Prefer "after" photos: that's the finished-work shot for the gallery.
      .sort(
        (a, b) =>
          (a.phase === "after" ? -1 : 0) - (b.phase === "after" ? -1 : 0),
      )
      .map((m) => m.image?.asset?._ref)
      .filter((v): v is string => Boolean(v));
    if (assetIds.length === 0) {
      return Response.json({ error: "Project has no photos" }, { status: 400 });
    }
    target = jpgUrl(assetIds[Math.min(index, assetIds.length - 1)]);
  }

  if (!target) {
    return Response.json(
      { error: "Provide an imageUrl or a project id" },
      { status: 400 },
    );
  }

  const result: GbpPhotoResult = await postGbpPhoto(target, {
    dryRun: !confirm,
  });
  return Response.json({ ok: true, dryRun: !confirm, result });
}

/**
 * Official Google Business Profile API control panel (password-gated).
 *
 * Body (all optional):
 *   {}, discover: list authorized accounts, and (if
 *                            GBP_ACCOUNT_ID is set) that account's locations,
 *                            so the owner can read off the ids for env.
 *   { test: true, id }, post a real Update + gallery photo for an existing
 *                            project, to confirm the connection end-to-end.
 *   { test: true, imageUrl, summary }, post an ad-hoc test Update/photo.
 *
 * Nothing posts unless `test: true` is passed AND all five GBP env vars are set.
 */
async function handleGbp(request: Request) {
  const {
    test = false,
    id,
    imageUrl,
    summary,
    accountId,
  } = (await request.json().catch(() => ({}))) as {
    test?: boolean;
    id?: string;
    imageUrl?: string;
    summary?: string;
    accountId?: string;
  };

  if (!test) {
    // accountId in the body lets us list locations before GBP_ACCOUNT_ID is
    // set in env (one fewer redeploy during first-time setup).
    return Response.json({ ok: true, discovery: await discoverGbp(accountId) });
  }

  if (!gbpReady()) {
    return Response.json(
      {
        ok: false,
        note: "GBP not fully connected, set GBP_CLIENT_ID/SECRET/REFRESH_TOKEN/ACCOUNT_ID/LOCATION_ID",
        discovery: await discoverGbp(),
      },
      { status: 400 },
    );
  }

  // Test against an existing project (preferred) or an ad-hoc image.
  if (id) {
    const client = getWriteClient();
    const doc = (await client.getDocument(id)) as ProjectDoc | undefined;
    if (!doc)
      return Response.json({ error: "Project not found" }, { status: 404 });
    const assetIds = (doc.media ?? [])
      .slice()
      .sort(
        (a, b) =>
          (a.phase === "after" ? -1 : 0) - (b.phase === "after" ? -1 : 0),
      )
      .map((m) => m.image?.asset?._ref)
      .filter((v): v is string => Boolean(v));
    if (assetIds.length === 0) {
      return Response.json({ error: "Project has no photos" }, { status: 400 });
    }
    const slug = (doc as { slug?: { current?: string } }).slug?.current;
    const results = await postJobToGbp({
      summary: doc.socialCaption ?? doc.title ?? "New roofing project",
      imageUrls: assetIds.map((a) => jpgUrl(a)),
      learnMoreUrl: slug
        ? `${siteConfig.url}/projects/${slug}`
        : `${siteConfig.url}/projects`,
    });
    return Response.json({ ok: true, id, results });
  }

  if (imageUrl) {
    const update = await createGbpUpdate({
      summary:
        summary ??
        "Southeast Roofing: quality roofing across South Mississippi.",
      imageUrl,
      learnMoreUrl: `${siteConfig.url}/projects`,
    });
    const gallery = await uploadGbpPhotos([imageUrl]);
    return Response.json({ ok: true, results: [update, ...gallery] });
  }

  return Response.json(
    { error: "Provide a project id or an imageUrl to test" },
    { status: 400 },
  );
}

/**
 * Backfill the GBP *Photos gallery* for jobs uploaded before the GBP API was
 * connected (password-gated). PHOTOS ONLY, no "Update" post, since those jobs
 * already went to the Posts feed + socials; this just gets their finished-work
 * photos into the profile's Photos tab. Prefers "after" photos.
 *
 * Body (all optional):
 *   { limit }, how many most-recent projects to include (default 5)
 *   { ids: [...] }, specific project ids instead of "most recent"
 *   { perProject }, max photos per job (default 3, to respect quota)
 *   { confirm: true }, actually post. WITHOUT it, a DRY RUN lists what would
 *                          be posted (project titles + photo counts), no calls.
 */
async function handleGbpBackfill(request: Request) {
  const {
    limit = 5,
    ids,
    perProject = 3,
    confirm = false,
  } = (await request.json().catch(() => ({}))) as {
    limit?: number;
    ids?: string[];
    perProject?: number;
    confirm?: boolean;
  };

  if (!gbpReady()) {
    return Response.json(
      { ok: false, note: "GBP not connected (set all five GBP_* env vars)" },
      { status: 400 },
    );
  }

  const client = getWriteClient();
  const n = Math.min(Math.max(1, limit), 20);
  const projects: ProjectDoc[] = ids?.length
    ? ((await Promise.all(ids.map((id) => client.getDocument(id)))).filter(
        Boolean,
      ) as ProjectDoc[])
    : await client.fetch(
        `*[_type == "project"] | order(_createdAt desc)[0...${n}]{ _id, title, media }`,
      );

  // Build each job's after-photo URL list (fall back to all photos).
  const plan = projects.map((p) => {
    const media = p.media ?? [];
    const refs = (
      media.some((m) => m.phase === "after")
        ? media.filter((m) => m.phase === "after")
        : media
    )
      .map((m) => m.image?.asset?._ref)
      .filter((v): v is string => Boolean(v))
      .slice(0, Math.max(1, perProject));
    return {
      id: p._id,
      title: p.title ?? "(untitled)",
      photos: refs.map(jpgUrl),
    };
  });

  if (!confirm) {
    return Response.json({
      dryRun: true,
      count: plan.length,
      projects: plan.map((p) => ({
        id: p.id,
        title: p.title,
        photos: p.photos.length,
      })),
    });
  }

  const results = [];
  for (const p of plan) {
    results.push({
      id: p.id,
      title: p.title,
      gallery: await uploadGbpPhotos(p.photos, perProject),
    });
  }
  return Response.json({ ok: true, count: results.length, results });
}

/**
 * One-time OAuth helper (password-gated). Two modes:
 *   { redirectUri }: returns the Google consent URL to open once. The
 *                            owner approves, and Google redirects to redirectUri
 *                            with a `?code=...`, copy that code.
 *   { code, redirectUri }, exchanges the code for a REFRESH TOKEN, returned
 *                            once so the owner can paste it into Vercel env as
 *                            GBP_REFRESH_TOKEN. We never store it ourselves.
 * Use "urn:ietf:wg:oauth:2.0:oob" or an authorized redirect URI configured on
 * the OAuth client; the same value must be used for both calls.
 */
async function handleGbpAuth(request: Request) {
  const { code, redirectUri = "urn:ietf:wg:oauth:2.0:oob" } = (await request
    .json()
    .catch(() => ({}))) as {
    code?: string;
    redirectUri?: string;
  };

  if (!process.env.GBP_CLIENT_ID || !process.env.GBP_CLIENT_SECRET) {
    return Response.json(
      { error: "Set GBP_CLIENT_ID + GBP_CLIENT_SECRET in env first" },
      { status: 400 },
    );
  }

  if (!code) {
    return Response.json({
      ok: true,
      step: "authorize",
      consentUrl: authConsentUrl(redirectUri),
      redirectUri,
      note: "Open consentUrl, approve, then POST back { code, redirectUri } with the returned code.",
    });
  }

  const result = await exchangeAuthCode(code, redirectUri);
  return Response.json(result);
}

interface ProjectDoc {
  _id: string;
  title?: string;
  slug?: { current?: string };
  socialCaption?: string;
  media?: Array<{
    image?: { asset?: { _ref?: string } };
    phase?: PhaseKey;
    alt?: string;
    title?: string;
    metaDescription?: string;
    filename?: string;
  }>;
  syndication?: Array<Record<string, unknown> & { platform?: string }>;
}

/**
 * Repost an EXISTING project to Google Business Profile + TikTok via Metricool
 * ONLY, deliberately skips the Meta (Facebook/Instagram) path so a job that
 * already went to FB/IG isn't double-posted there. Reuses the job's stored
 * caption and photos (re-badging before/after just like the original post).
 */
async function handleMetricool(request: Request) {
  const { id, networks } = (await request.json()) as {
    id?: string;
    networks?: Array<"google-business" | "tiktok">;
  };
  if (!id) return Response.json({ error: "No id provided" }, { status: 400 });

  const client = getWriteClient();
  const doc = (await client.getDocument(id)) as ProjectDoc | undefined;
  if (!doc)
    return Response.json({ error: "Project not found" }, { status: 404 });

  const rawMedia: MediaEntry[] = (doc.media ?? [])
    .map((m) => ({
      assetId: m.image?.asset?._ref ?? "",
      phase: (m.phase ?? "after") as PhaseKey,
      alt: m.alt ?? "",
      title: m.title ?? "",
      metaDescription: m.metaDescription ?? "",
      filename: m.filename ?? "photo.jpg",
    }))
    .filter((m) => m.assetId);

  if (rawMedia.length === 0) {
    return Response.json({ error: "Project has no photos" }, { status: 400 });
  }

  const media = [...rawMedia].sort(
    (a, b) => (PHASE_RANK[a.phase] ?? 1) - (PHASE_RANK[b.phase] ?? 1),
  );

  // A repost obeys the same marketer rules as a fresh post, finished work
  // leads, before/after alternates, at most one during-install shot. Reposting
  // in raw install order is how plywood ends up in front of a caption.
  const plan = planSocialPost(media);
  if (plan.hold) {
    return Response.json(
      { error: `Not postable: ${plan.reason}` },
      { status: 400 },
    );
  }
  const imageUrls = plan.order.map((m) => jpgUrl(m.assetId)).filter(Boolean);
  const caption = doc.socialCaption ?? doc.title ?? "";

  // Repost default targets BOTH networks; build the TikTok slideshow whenever
  // TikTok is in scope so it posts a real video instead of rejected photos.
  const targets: Array<"google-business" | "tiktok"> = networks?.length
    ? networks
    : ["google-business", "tiktok"];
  const videoUrl = targets.includes("tiktok")
    ? await tiktokVideoUrl(imageUrls, client)
    : undefined;

  const results = await postViaMetricool(
    { text: caption, imageUrls, videoUrl },
    targets,
  );

  // Merge into the syndication log: keep FB/IG (and anything else) untouched,
  // replace only the google-business + tiktok entries with this run's outcome.
  const now = new Date().toISOString();
  const kept = (doc.syndication ?? []).filter(
    (s) => s.platform !== "google-business" && s.platform !== "tiktok",
  );
  const merged = [
    ...kept,
    ...results.map((r) => ({
      _key: randomUUID(),
      _type: "syndicationTarget",
      platform: r.network,
      status: r.status,
      note: r.note,
      postedAt: r.status === "posted" ? now : undefined,
    })),
  ];
  await client.patch(id).set({ syndication: merged }).commit();

  return Response.json({
    ok: true,
    id,
    title: doc.title,
    photos: imageUrls.length,
    results,
  });
}

/**
 * Submit every sitemap URL to IndexNow (Bing/Yandex/DuckDuckGo instant crawl,
 * NOT Google). Password-gated; run once now to seed the engines, and any time a
 * batch of pages changes. Returns how many URLs were sent + the engines' ack.
 */
async function handleIndexNow() {
  const entries = await sitemap();
  const urls = entries.map((e) => (typeof e.url === "string" ? e.url : ""));
  const result = await submitToIndexNow(urls);
  return Response.json({ ok: result.status !== "error", ...result });
}

/** Force-refresh cached content on demand (password-gated). Covers live Google
 *  reviews (cached ~24h) AND the project gallery, so a just-uploaded job can be
 *  pushed live instantly instead of waiting out the gallery's cache window. */
function handleRevalidate() {
  // Purge the cached fetches (they survive revalidatePath), then the pages.
  revalidateTag("google-reviews", "max");
  revalidateTag("projects", "max");
  const paths = ["/", "/reviews", "/projects", "/project-map"];
  for (const p of paths) revalidatePath(p);
  return Response.json({
    ok: true,
    revalidatedTags: ["google-reviews", "projects"],
    revalidated: paths,
  });
}

/** Upload a single photo and return its generated SEO + asset id. */
async function handleAsset(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const phase = String(form.get("phase") ?? "after") as PhaseKey;
  const index = Number(form.get("index") ?? 0);
  const ctx = JSON.parse(String(form.get("ctx") ?? "{}")) as JobSubmission;

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const seo = photoSeo(ctx, phase, index);
  const buffer = Buffer.from(await file.arrayBuffer());
  const client = getWriteClient();
  const asset = await client.assets.upload("image", buffer, {
    filename: seo.filename,
    contentType: file.type || "image/jpeg",
  });

  return Response.json({
    assetId: asset._id,
    phase,
    alt: seo.alt,
    title: seo.title,
    metaDescription: seo.metaDescription,
    filename: seo.filename,
  });
}

interface MediaEntry {
  assetId: string;
  phase: PhaseKey;
  alt: string;
  title: string;
  metaDescription: string;
  filename: string;
}

/**
 * Build the caption for a given photo plan. The writer is told what the
 * carousel actually contains, so the words can never describe photos that
 * aren't in the post.
 */
async function buildCaption(
  submission: JobSubmission,
  media: MediaEntry[],
  plan?: SocialPlan<MediaEntry>,
): Promise<{ caption: string; plan: SocialPlan<MediaEntry> }> {
  const resolved = plan ?? planSocialPost(media);
  const brief = captionBrief(resolved);
  const body =
    (await polishCaption(submission, brief)) ?? deterministicBody(submission);
  // A reveal gets an explicit swipe cue: slide one is the OLD roof, and with no
  // burned-in labels (owner rule 2026-08-01) the caption is what says so.
  const lead =
    resolved.shape === "reveal"
      ? `📸 Swipe to see the before and after 👉\n\n${body}`
      : body;
  return { caption: assembleCaption(submission, lead), plan: resolved };
}

/**
 * Dry run: decide the post and write the caption WITHOUT publishing anything.
 * Feeds the confirm screen so the owner sees the cover photo, the carousel
 * order, and the words before a single platform is touched.
 */
async function handlePlan(request: Request) {
  const { submission, media: rawMedia } = (await request.json()) as {
    submission: JobSubmission;
    media: MediaEntry[];
  };
  const media = [...rawMedia].sort(
    (a, b) => (PHASE_RANK[a.phase] ?? 1) - (PHASE_RANK[b.phase] ?? 1),
  );

  // Let Claude look at the finished photos and pick the one that leads.
  const afters = media.filter((m) => m.phase === "after");
  const hero = afters.length
    ? await pickHeroPhoto(afters.map((m) => jpgUrl(m.assetId)))
    : { index: 0, note: undefined };

  const plan = planSocialPost(media, hero.index);
  const { caption } = await buildCaption(submission, media, plan);

  return Response.json({
    shape: plan.shape,
    hold: plan.hold,
    reason: plan.reason,
    caption,
    heroNote: hero.note,
    heroAssetId: plan.hero?.assetId,
    order: plan.order.map((m) => ({
      assetId: m.assetId,
      phase: m.phase,
      url: jpgUrl(m.assetId),
    })),
    omitted: plan.omitted.map((m) => ({
      assetId: m.assetId,
      phase: m.phase,
      url: jpgUrl(m.assetId),
    })),
  });
}

/** Assemble + publish the project from already-uploaded assets. Returns as soon
 *  as the website is updated, social goes out one platform per request after
 *  this, so no single invocation carries the whole fan-out. */
async function handleCreate(request: Request) {
  const body = (await request.json()) as {
    submission: JobSubmission;
    media: MediaEntry[];
    /** Approved on the confirm screen. */
    caption?: string;
  };
  const { submission, media: rawMedia } = body;
  const client = getWriteClient();
  const jt = getJobType(submission.jobType);

  // Order photos before -> during -> after in the Sanity doc. The SOCIAL order
  // is a separate decision made by planSocialPost (step=plan), install order
  // is right for the website and wrong for a feed.
  const media = [...rawMedia].sort(
    (a, b) => (PHASE_RANK[a.phase] ?? 1) - (PHASE_RANK[b.phase] ?? 1),
  );

  const title = jobTitle(submission);
  const slug = `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;

  const details = Object.entries(submission.details ?? {})
    .map(([key, value]) => {
      const field = jt?.fields.find((f) => f.key === key);
      const text = Array.isArray(value) ? value.join(", ") : value;
      if (!text) return null;
      return {
        _key: randomUUID(),
        _type: "detail",
        key,
        label: field?.label ?? key,
        value: text,
      };
    })
    .filter(Boolean);

  const mediaDocs = media.map((m) => ({
    _key: randomUUID(),
    _type: "jobPhoto",
    image: { _type: "image", asset: { _type: "reference", _ref: m.assetId } },
    phase: m.phase,
    alt: m.alt,
    title: m.title,
    metaDescription: m.metaDescription,
    filename: m.filename,
  }));

  // The caption was approved on the confirm screen; fall back to generating one
  // only if this was called without going through step=plan.
  const caption =
    body.caption ?? (await buildCaption(submission, media)).caption;
  const tags = jobTags(submission);

  const doc = await client.create({
    _type: "project",
    title,
    slug: { _type: "slug", current: slug },
    channel: submission.channel,
    jobType: submission.jobType,
    city: submission.city,
    summary: jobSummary(submission),
    description: submission.description,
    details,
    media: mediaDocs,
    tags,
    featured: Boolean(submission.featured),
    socialCaption: caption,
  });

  // Regenerate the gallery now so the new job (and its filter) appear
  // immediately. revalidateTag purges the (fresh, non-CDN) project fetch cache
  // reliably; revalidatePath rebuilds the pages that render it.
  revalidateTag("projects", "max");
  revalidatePath("/projects");
  revalidatePath("/project-map");
  if (submission.featured) revalidatePath("/");

  // Ping IndexNow so Bing/DuckDuckGo pick up the new job page fast (best-effort;
  // Google ignores IndexNow and finds it via the sitemap instead).
  const indexnow = await submitToIndexNow([
    `${siteConfig.url}/projects/${slug}`,
    `${siteConfig.url}/projects`,
    `${siteConfig.url}/project-map`,
  ]);

  // Post-job Google review request: auto-email the customer (if an email was
  // provided) and always return tap-to-send sms/mailto links so the owner can
  // fire one off from their phone. Opt-in per upload, nothing without contact.
  let reviewRequest:
    { emailSent: boolean; smsHref?: string; mailtoHref?: string } | undefined;
  if (submission.customerEmail || submission.customerPhone) {
    const emailSent = submission.customerEmail
      ? await sendReviewRequestEmail({
          name: submission.customerName,
          email: submission.customerEmail,
        })
      : false;
    reviewRequest = {
      emailSent,
      ...reviewRequestLinks({
        name: submission.customerName,
        email: submission.customerEmail,
        phone: submission.customerPhone,
      }),
    };
  }

  return Response.json({
    ok: true,
    id: doc._id,
    title,
    slug,
    url: `${siteConfig.url}/projects`,
    indexnow,
    reviewRequest,
  });
}

/** Networks the /upload flow posts to, one request each, in this order. */
const SOCIAL_STEPS = ["facebook", "instagram", "google", "tiktok"] as const;
export type SocialStep = (typeof SOCIAL_STEPS)[number];

/**
 * Post ONE platform for an already-published job, then log the outcome on the
 * document. Splitting the fan-out this way is the fix for 2026-07-31, when a
 * single request tried to carry Facebook, Instagram, Google, and a TikTok video
 * encode, blew its 60-second budget partway through Instagram, and left no
 * record that the other three had never run.
 */
async function handleSocial(request: Request) {
  const { id, platform, caption, slug, order, heroAssetId } =
    (await request.json()) as {
      id: string;
      platform: SocialStep;
      caption: string;
      slug: string;
      order: { assetId: string }[];
      heroAssetId?: string;
    };

  if (!id || !platform || !SOCIAL_STEPS.includes(platform)) {
    return Response.json({ error: "Bad platform request" }, { status: 400 });
  }

  const client = getWriteClient();
  const imageUrls = (order ?? []).map((m) => jpgUrl(m.assetId)).filter(Boolean);
  if (imageUrls.length === 0) {
    return Response.json(await log("skipped", "No photos in the plan"));
  }

  const title = "";
  const projectUrl = `${siteConfig.url}/projects/${slug}`;
  let result: { platform: string; status: string; url?: string; note?: string };

  if (platform === "facebook" || platform === "instagram") {
    result = await postToMeta(platform, {
      caption,
      imageUrls,
      title,
      projectUrl,
    });
  } else if (platform === "google") {
    // Google shows ONE photo with no swipe, so it gets the hero, the finished
    // roof Claude picked, never a "before".
    const heroUrl = heroAssetId ? jpgUrl(heroAssetId) : imageUrls[0];
    if (!gbpReady()) {
      result = {
        platform: "google-business",
        status: "skipped",
        note: "Not connected",
      };
    } else {
      const gbp = await postJobToGbp({
        summary: caption,
        imageUrls: [heroUrl],
        learnMoreUrl: projectUrl,
      });
      const errored = gbp.find((r) => r.status === "error");
      result = {
        platform: "google-business",
        status: gbp.some((r) => r.status === "posted")
          ? "posted"
          : errored
            ? "error"
            : "skipped",
        note: errored?.note,
      };
    }
  } else {
    // TikTok rejects photo posts, so the carousel becomes a slideshow MP4. This
    // is the single most expensive step in the pipeline, which is exactly why
    // it now owns its own request instead of running behind everything else.
    const videoUrl = await tiktokVideoUrl(imageUrls, client);
    if (!videoUrl) {
      result = {
        platform: "tiktok",
        status: "skipped",
        note: "Slideshow video could not be built",
      };
    } else {
      const [r] = await postViaMetricool(
        { text: caption, imageUrls, videoUrl },
        ["tiktok"],
      );
      result = { platform: "tiktok", status: r.status, note: r.note };
    }
  }

  return Response.json(await log(result.status, result.note, result.url));

  /** Replace this platform's row in the syndication log, keeping the others. */
  async function log(status: string, note?: string, url?: string) {
    const entry = {
      _key: randomUUID(),
      _type: "syndicationTarget",
      platform: platform === "google" ? "google-business" : platform,
      status,
      url,
      note,
      postedAt: status === "posted" ? new Date().toISOString() : undefined,
    };
    try {
      const existing = ((await client.getDocument(id)) as ProjectDoc)
        ?.syndication as Array<Record<string, unknown>> | undefined;
      const kept = (existing ?? []).filter(
        (s) => s.platform !== entry.platform,
      );
      await client
        .patch(id)
        .set({ syndication: [...kept, entry] })
        .commit();
    } catch {
      // Logging is best-effort, the post itself already went out (or didn't),
      // and the client is told either way.
    }
    return { platform: entry.platform, status, note, url };
  }
}
