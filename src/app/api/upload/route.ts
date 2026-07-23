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
import { syndicate } from "@/lib/syndicate";
import {
  postViaMetricool,
  inspectMetricool,
  listMetricoolPosts,
  deleteMetricoolPosts,
  postGbpPhoto,
  postGbpPhotos,
  metricoolGalleryEnabled,
  type GbpPhotoResult,
} from "@/lib/metricool";
import { diagnoseReviews } from "@/lib/google-reviews";
import { badgeImage } from "@/lib/social-badge";
import { buildSlideshow } from "@/lib/slideshow";
import {
  gbpConfigured,
  gbpReady,
  discoverGbp,
  authConsentUrl,
  exchangeAuthCode,
  postJobToGbp,
  uploadGbpPhotos,
  createGbpUpdate,
  type GbpPostResult,
} from "@/lib/gbp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Building the TikTok slideshow (download + sharp frames + ffmpeg encode) plus
// the social fan-out needs more than the default budget.
export const maxDuration = 60;

/**
 * Build the TikTok slideshow MP4 from the job's social photos and upload it to
 * Sanity as a public file, returning its CDN URL (or undefined on any failure —
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

/**
 * Public JPEG URLs for the social fan-out. On a genuine before/after job every
 * photo gets a burned-in BEFORE/DURING/AFTER badge so a single image can't be
 * mistaken for fresh work. Best-effort per photo — any failure (or a non
 * before/after job) falls back to the plain, unbadged photo so a social post is
 * never blocked.
 */
async function socialImageUrls(
  media: MediaEntry[],
  client: ReturnType<typeof getWriteClient>,
  labelPhotos: boolean,
): Promise<string[]> {
  if (!labelPhotos) return media.map((m) => jpgUrl(m.assetId)).filter(Boolean);
  const urls: string[] = [];
  for (const m of media) {
    const plain = jpgUrl(m.assetId);
    try {
      const res = await fetch(plain);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const badged = await badgeImage(
        Buffer.from(await res.arrayBuffer()),
        m.phase,
      );
      const asset = await client.assets.upload("image", badged, {
        filename: `social-${m.phase}-${m.filename}`,
        contentType: "image/jpeg",
      });
      urls.push(jpgUrl(asset._id));
    } catch {
      urls.push(plain); // fall back to the unbadged photo
    }
  }
  return urls.filter(Boolean);
}

/**
 * Two-step upload to stay under the per-request body limit:
 *   ?step=asset  — one photo at a time → uploads to Sanity, returns its SEO
 *   ?step=create — assembles + publishes the project, then syndicates
 * The whole route sits behind the password gate in proxy.ts.
 */
export async function POST(request: Request) {
  const step = new URL(request.url).searchParams.get("step");
  try {
    if (step === "asset") return await handleAsset(request);
    if (step === "create") return await handleCreate(request);
    if (step === "delete") return await handleDelete(request);
    if (step === "metricool") return await handleMetricool(request);
    if (step === "metricool-clean") return await handleMetricoolClean(request);
    if (step === "gbp-photo") return await handleGbpPhoto(request);
    if (step === "gbp") return await handleGbp(request);
    if (step === "gbp-auth") return await handleGbpAuth(request);
    if (step === "check") return await handleCheck();
    if (step === "revalidate") return handleRevalidate();
    return Response.json({ error: "Unknown step" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

/** Delete a project by id (password-gated via proxy). For removing a bad or
 *  test upload. Leaves image assets unreferenced (harmless). */
async function handleDelete(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) return Response.json({ error: "No id provided" }, { status: 400 });
  const client = getWriteClient();
  await client.delete(id);
  revalidateTag("projects", "max");
  revalidatePath("/projects");
  revalidatePath("/project-map");
  return Response.json({ ok: true, deleted: id });
}

/**
 * Diagnostic (password-gated): reports whether live Google reviews and the
 * Metricool credentials are actually working in THIS environment. Never leaks
 * secret values — only presence booleans + upstream status/messages.
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
  // Official Google Business Profile API — Tier 1. Presence booleans only,
  // never the secret values. `ready` means uploads auto-post to GBP.
  const gbp = {
    clientIdPresent: Boolean(process.env.GBP_CLIENT_ID),
    clientSecretPresent: Boolean(process.env.GBP_CLIENT_SECRET),
    refreshTokenPresent: Boolean(process.env.GBP_REFRESH_TOKEN),
    accountIdPresent: Boolean(process.env.GBP_ACCOUNT_ID),
    locationIdPresent: Boolean(process.env.GBP_LOCATION_ID),
    // OAuth creds set (can discover ids / do the one-time auth):
    configured: gbpConfigured(),
    // Fully wired — every upload now auto-posts to GBP:
    autoPost: gbpReady(),
  };
  return Response.json({
    reviews,
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
 *   { imageUrl }        — post this exact public image
 *   { id, index }       — post one photo (default the first) from an existing
 *                         project, preferring an "after" photo
 *   { confirm: true }   — actually send. WITHOUT it this is a DRY RUN that
 *                         returns the exact body that WOULD be sent, no network
 *                         call — so the flag is inspectable before anything goes
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
      // Prefer "after" photos — that's the finished-work shot for the gallery.
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
 *   {}                     — discover: list authorized accounts, and (if
 *                            GBP_ACCOUNT_ID is set) that account's locations,
 *                            so the owner can read off the ids for env.
 *   { test: true, id }     — post a real Update + gallery photo for an existing
 *                            project, to confirm the connection end-to-end.
 *   { test: true, imageUrl, summary } — post an ad-hoc test Update/photo.
 *
 * Nothing posts unless `test: true` is passed AND all five GBP env vars are set.
 */
async function handleGbp(request: Request) {
  const {
    test = false,
    id,
    imageUrl,
    summary,
  } = (await request.json().catch(() => ({}))) as {
    test?: boolean;
    id?: string;
    imageUrl?: string;
    summary?: string;
  };

  if (!test) {
    return Response.json({ ok: true, discovery: await discoverGbp() });
  }

  if (!gbpReady()) {
    return Response.json(
      {
        ok: false,
        note: "GBP not fully connected — set GBP_CLIENT_ID/SECRET/REFRESH_TOKEN/ACCOUNT_ID/LOCATION_ID",
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
      summary: summary ?? "Southeast Roofing — quality roofing across South Mississippi.",
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
 * One-time OAuth helper (password-gated). Two modes:
 *   { redirectUri }        — returns the Google consent URL to open once. The
 *                            owner approves, and Google redirects to redirectUri
 *                            with a `?code=...` — copy that code.
 *   { code, redirectUri }  — exchanges the code for a REFRESH TOKEN, returned
 *                            once so the owner can paste it into Vercel env as
 *                            GBP_REFRESH_TOKEN. We never store it ourselves.
 * Use "urn:ietf:wg:oauth:2.0:oob" or an authorized redirect URI configured on
 * the OAuth client; the same value must be used for both calls.
 */
async function handleGbpAuth(request: Request) {
  const { code, redirectUri = "urn:ietf:wg:oauth:2.0:oob" } =
    (await request.json().catch(() => ({}))) as {
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
 * ONLY — deliberately skips the Meta (Facebook/Instagram) path so a job that
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
  const labelPhotos =
    media.some((m) => m.phase === "before") &&
    media.some((m) => m.phase === "after");

  const imageUrls = await socialImageUrls(media, client, labelPhotos);
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

/** Force-refresh cached content on demand (password-gated). Covers live Google
 *  reviews (cached ~24h) AND the project gallery — so a just-uploaded job can be
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

/** Assemble + publish the project from already-uploaded assets, then syndicate. */
async function handleCreate(request: Request) {
  const body = (await request.json()) as {
    submission: JobSubmission;
    media: MediaEntry[];
  };
  const { submission, media: rawMedia } = body;
  const client = getWriteClient();
  const jt = getJobType(submission.jobType);

  // Order photos before -> during -> after everywhere (Sanity doc + social).
  const media = [...rawMedia].sort(
    (a, b) => (PHASE_RANK[a.phase] ?? 1) - (PHASE_RANK[b.phase] ?? 1),
  );
  const hasBefore = media.some((m) => m.phase === "before");
  const hasAfter = media.some((m) => m.phase === "after");
  const labelPhotos = hasBefore && hasAfter;

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

  // Polished caption: AI when a key is set, deterministic template otherwise.
  // Never the owner's raw notes verbatim. Before/after jobs get an explicit
  // "before & after" lead so viewers know the old roof isn't fresh work.
  const aiBody =
    (await polishCaption(submission)) ?? deterministicBody(submission);
  const captionBody = labelPhotos
    ? `📸 Swipe to see the BEFORE & AFTER 👉\n\n${aiBody}`
    : aiBody;
  const caption = assembleCaption(submission, captionBody);
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

  // Public CDN URLs for social fan-out (photos are hosted by Sanity now).
  // Force JPEG — Instagram's publishing API rejects WebP/PNG. Before/after
  // jobs get per-photo BEFORE/AFTER badges burned in.
  const imageUrls = await socialImageUrls(media, client, labelPhotos);
  const projectUrl = `${siteConfig.url}/projects`;

  const results = await syndicate({ caption, imageUrls, title, projectUrl });

  // TikTok rejects photo posts, so syndicate() skips it. Build the slideshow
  // MP4 and post it to TikTok via Metricool as a video — best-effort and AFTER
  // the other networks, so a slow or failed encode never blocks FB/IG/GBP or
  // the upload itself. tiktokVideoUrl returns undefined on any failure.
  const videoUrl = await tiktokVideoUrl(imageUrls, client);
  if (videoUrl) {
    for (const r of await postViaMetricool(
      { text: caption, imageUrls, videoUrl },
      ["tiktok"],
    )) {
      results.push({ platform: r.network, status: r.status, note: r.note });
    }
  } else {
    results.push({
      platform: "tiktok",
      status: "skipped",
      note: "Slideshow video could not be built",
    });
  }

  // Record what happened on each platform (no-op targets show as "skipped").
  await client
    .patch(doc._id)
    .set({
      syndication: results.map((r) => ({
        _key: randomUUID(),
        _type: "syndicationTarget",
        platform: r.platform,
        status: r.status,
        url: r.url,
        postedAt: r.postedAt,
        note: r.note,
      })),
    })
    .commit();

  // Also push the finished-work photos to the GBP *Photos gallery* (a separate
  // surface from the Posts feed the syndicate() call above already hit). Env-
  // gated OFF until the flag is confirmed live via step=gbp-photo, so this is a
  // no-op for now and never blocks the upload. Prefer "after" photos; fall back
  // to whatever we have.
  let gallery: GbpPhotoResult[] | undefined;
  if (metricoolGalleryEnabled()) {
    const afterUrls = imageUrls.filter((_, i) => media[i]?.phase === "after");
    gallery = await postGbpPhotos(afterUrls.length ? afterUrls : imageUrls);
  }

  // Tier 1: the OFFICIAL Google Business Profile API push — the finished-work
  // photos to the Photos gallery AND one "Update" (photo + caption + Learn-more
  // button to this job's project page). Prefers "after" photos. No-op until all
  // five GBP env vars are set (gbpReady), so it never blocks the upload. Runs
  // after the Sanity write so the project page the button links to already
  // exists.
  let gbp: GbpPostResult[] | undefined;
  if (gbpReady()) {
    const afterUrls = imageUrls.filter((_, i) => media[i]?.phase === "after");
    gbp = await postJobToGbp({
      summary: caption,
      imageUrls: afterUrls.length ? afterUrls : imageUrls,
      learnMoreUrl: `${siteConfig.url}/projects/${slug}`,
    });
    // Fold the GBP outcome into the syndication log under "google-business".
    const now = new Date().toISOString();
    const posted = gbp.some((r) => r.status === "posted");
    const errored = gbp.find((r) => r.status === "error");
    try {
      const existing = ((await client.getDocument(doc._id)) as ProjectDoc)
        ?.syndication as Array<Record<string, unknown>> | undefined;
      const kept = (existing ?? []).filter(
        (s) => s.platform !== "google-business",
      );
      await client
        .patch(doc._id)
        .set({
          syndication: [
            ...kept,
            {
              _key: randomUUID(),
              _type: "syndicationTarget",
              platform: "google-business",
              status: posted ? "posted" : errored ? "error" : "skipped",
              note: errored?.note,
              postedAt: posted ? now : undefined,
            },
          ],
        })
        .commit();
    } catch {
      // Logging the outcome is best-effort — the posts already went out.
    }
  }

  // Regenerate the gallery now so the new job (and its filter) appear
  // immediately. revalidateTag purges the (fresh, non-CDN) project fetch cache
  // reliably; revalidatePath rebuilds the pages that render it.
  revalidateTag("projects", "max");
  revalidatePath("/projects");
  revalidatePath("/project-map");
  if (submission.featured) revalidatePath("/");

  return Response.json({
    ok: true,
    id: doc._id,
    title,
    slug,
    url: projectUrl,
    gallery,
    gbp,
  });
}
