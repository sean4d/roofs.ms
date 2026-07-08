import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

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
} from "@/lib/metricool";
import { diagnoseReviews } from "@/lib/google-reviews";
import { badgeImage } from "@/lib/social-badge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Install-timeline order so social carousels read before -> during -> after. */
const PHASE_RANK: Record<string, number> = { before: 0, progress: 1, after: 2 };

function jpgUrl(assetId: string): string {
  return urlFor({ _type: "image", asset: { _type: "reference", _ref: assetId } })
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
      const badged = await badgeImage(Buffer.from(await res.arrayBuffer()), m.phase);
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
    if (step === "check") return await handleCheck();
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
  revalidatePath("/projects");
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
  };
  const anthropicKeyPresent = Boolean(process.env.ANTHROPIC_API_KEY);
  const metricoolPosts = await inspectMetricool();
  return Response.json({ reviews, metricool, anthropicKeyPresent, metricoolPosts });
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
  const ids = targets.map((p) => p.id).filter((v): v is number => typeof v === "number");

  const byStatus: Record<string, number> = {};
  for (const p of targets)
    for (const pr of p.providers ?? [])
      if (pr.status) byStatus[`${pr.network}:${pr.status}`] = (byStatus[`${pr.network}:${pr.status}`] ?? 0) + 1;

  if (!confirm) {
    return Response.json({ dryRun: true, matched: ids.length, byStatus, ids });
  }
  const deleted = await deleteMetricoolPosts(ids);
  const okCount = deleted.filter((d) => d.ok).length;
  return Response.json({ dryRun: false, attempted: ids.length, deleted: okCount, results: deleted });
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
  if (!doc) return Response.json({ error: "Project not found" }, { status: 404 });

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
    media.some((m) => m.phase === "before") && media.some((m) => m.phase === "after");

  const imageUrls = await socialImageUrls(media, client, labelPhotos);
  const caption = doc.socialCaption ?? doc.title ?? "";

  const results = await postViaMetricool({ text: caption, imageUrls }, networks);

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

  return Response.json({ ok: true, id, title: doc.title, photos: imageUrls.length, results });
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
      return { _key: randomUUID(), _type: "detail", key, label: field?.label ?? key, value: text };
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
  const aiBody = (await polishCaption(submission)) ?? deterministicBody(submission);
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

  // Regenerate the gallery now so the new job (and its filter) appear immediately.
  revalidatePath("/projects");
  if (submission.featured) revalidatePath("/");

  return Response.json({ ok: true, id: doc._id, title, slug, url: projectUrl });
}
