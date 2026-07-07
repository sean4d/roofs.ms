import { randomUUID } from "node:crypto";

import { getWriteClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { getJobType, type PhaseKey } from "@/config/job-taxonomy";
import { siteConfig } from "@/config/site";
import {
  jobSummary,
  jobTags,
  jobTitle,
  photoSeo,
  slugify,
  socialCaption,
  type JobSubmission,
} from "@/lib/job-content";
import { syndicate } from "@/lib/syndicate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    return Response.json({ error: "Unknown step" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
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
  const { submission, media } = body;
  const client = getWriteClient();
  const jt = getJobType(submission.jobType);

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

  const caption = socialCaption(submission);
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
    completedAt: submission.completedAt || undefined,
    featured: Boolean(submission.featured),
    socialCaption: caption,
  });

  // Public CDN URLs for social fan-out (photos are hosted by Sanity now).
  const imageUrls = media
    .map((m) =>
      urlFor({ _type: "image", asset: { _type: "reference", _ref: m.assetId } })
        .width(1200)
        .url(),
    )
    .filter(Boolean);
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

  return Response.json({ ok: true, id: doc._id, title, slug, url: projectUrl });
}
