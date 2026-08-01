"use client";

import { useState } from "react";

import {
  CHANNELS,
  CITY_OPTIONS,
  JOB_TYPES,
  PHASES,
  getJobType,
  type DetailField,
  type PhaseKey,
} from "@/config/job-taxonomy";

type DetailValue = string | string[];
type Files = Record<PhaseKey, File[]>;

const OTHER_CITY = "Other (type below)";

interface MediaEntry {
  assetId: string;
  phase: PhaseKey;
}

interface PlanPhoto {
  assetId: string;
  phase: PhaseKey;
  url: string;
}

/** What step=plan returns — the post, decided, before anything is published. */
interface SocialPlanView {
  shape: "showcase" | "reveal" | "hold";
  hold: boolean;
  reason: string;
  caption: string;
  heroNote?: string;
  heroAssetId?: string;
  order: PlanPhoto[];
  omitted: PlanPhoto[];
}

/** Posted one request each, in this order. */
const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "google", label: "Google Business Profile" },
  { key: "tiktok", label: "TikTok" },
] as const;

type ChannelState = "idle" | "working" | "done" | "error" | "skipped";

const PHASE_CHIP: Record<string, string> = {
  before: "Before",
  progress: "During install",
  after: "After",
};

/**
 * Pull a usable message off a failed response. The old code assumed every error
 * body was JSON, so when a gateway returned an HTML page the JSON parse threw
 * and Safari's "The string did not match the expected pattern" replaced the
 * real error — hiding a 504 for a full day.
 */
async function errorFrom(res: Response, fallback: string): Promise<string> {
  const text = await res.text().catch(() => "");
  try {
    const parsed = JSON.parse(text) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // not JSON — fall through to the status line
  }
  const snippet = text.replace(/<[^>]*>/g, " ").trim().slice(0, 120);
  return `${fallback} (HTTP ${res.status}${snippet ? `: ${snippet}` : ""})`;
}

/** Downscale + re-encode a phone photo so uploads stay small and reliable. */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const maxDim = 1800;
    let { width, height } = bitmap;
    const longest = Math.max(width, height);
    if (longest > maxDim) {
      const scale = maxDim / longest;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) return file;
    const base = file.name.replace(/\.\w+$/, "");
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file; // fall back to the original if the browser can't decode it
  }
}

export function UploadForm() {
  const [jobType, setJobType] = useState("");
  const [channel, setChannel] = useState<"residential" | "commercial">("residential");
  const [city, setCity] = useState("");
  const [cityCustom, setCityCustom] = useState("");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [details, setDetails] = useState<Record<string, DetailValue>>({});
  const [files, setFiles] = useState<Files>({ before: [], progress: [], after: [] });

  const [status, setStatus] = useState<
    "idle" | "working" | "review" | "done" | "error"
  >("idle");
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<SocialPlanView | null>(null);
  const [pending, setPending] = useState<{
    submission: Record<string, unknown>;
    media: MediaEntry[];
  } | null>(null);
  const [channels, setChannels] = useState<
    Record<string, { state: ChannelState; note?: string }>
  >({});
  const [socialBusy, setSocialBusy] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    url: string;
    id?: string;
    slug?: string;
    caption?: string;
    reviewRequest?: {
      emailSent: boolean;
      smsHref?: string;
      mailtoHref?: string;
    };
  } | null>(null);

  const activeJob = getJobType(jobType);
  const totalPhotos = files.before.length + files.progress.length + files.after.length;

  function setDetail(key: string, value: DetailValue) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: string, option: string) {
    setDetails((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  }

  function setPhaseFiles(phase: PhaseKey, list: FileList | null) {
    setFiles((prev) => ({ ...prev, [phase]: list ? Array.from(list) : [] }));
  }

  /** Upload the photos, then ask the server what the post should look like. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const resolvedCity = city === OTHER_CITY ? cityCustom.trim() : city;
    if (!jobType) return setMessage("Pick a job type.");
    if (!resolvedCity) return setMessage("Choose or type the city.");
    if (totalPhotos === 0) return setMessage("Add at least one photo.");

    setStatus("working");
    const submission = {
      jobType,
      channel,
      city: resolvedCity,
      details,
      description,
      featured,
      customerName: customerName.trim() || undefined,
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
    };

    try {
      const media: MediaEntry[] = [];
      let done = 0;
      for (const phase of PHASES) {
        const list = files[phase.key];
        for (let i = 0; i < list.length; i++) {
          setProgress(`Uploading photo ${done + 1} of ${totalPhotos}…`);
          const compressed = await compressImage(list[i]);
          const fd = new FormData();
          fd.append("file", compressed);
          fd.append("phase", phase.key);
          fd.append("index", String(i));
          fd.append("ctx", JSON.stringify(submission));
          const res = await fetch("/api/upload?step=asset", { method: "POST", body: fd });
          if (!res.ok) throw new Error(await errorFrom(res, "Photo upload failed"));
          media.push((await res.json()) as MediaEntry);
          done++;
        }
      }

      setProgress("Working out the best post…");
      const res = await fetch("/api/upload?step=plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission, media }),
      });
      if (!res.ok) throw new Error(await errorFrom(res, "Could not plan the post"));
      setPlan((await res.json()) as SocialPlanView);
      setPending({ submission, media });
      setStatus("review");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  /**
   * Publish the job, then post ONE platform per request. Splitting it this way
   * is what stops a slow network from swallowing the ones queued behind it —
   * and every outcome lands in `channels` so nothing fails silently again.
   */
  async function publish(skipSocial: boolean) {
    if (!pending || !plan) return;
    setStatus("working");
    setMessage("");
    try {
      setProgress("Publishing to your gallery…");
      const res = await fetch("/api/upload?step=create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: pending.submission,
          media: pending.media,
          caption: plan.caption,
        }),
      });
      if (!res.ok) throw new Error(await errorFrom(res, "Publish failed"));
      const data = await res.json();

      setResult({
        title: data.title,
        url: data.url,
        id: data.id,
        slug: data.slug,
        reviewRequest: data.reviewRequest,
      });
      setStatus("done");

      if (skipSocial || plan.hold || plan.order.length === 0) return;
      await runSocial(data.id, data.slug, SOCIAL_PLATFORMS.map((p) => p.key));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  /**
   * Post the given platforms, one request each, updating the checklist as they
   * land. Callable again from the success screen: before this existed, a job
   * that published without its social run had no route back except a developer
   * hitting the API by hand.
   */
  async function runSocial(id: string, slug: string, platforms: readonly string[]) {
    if (!plan) return;
    setSocialBusy(true);
    for (const key of platforms) {
      setChannels((c) => ({ ...c, [key]: { state: "working" } }));
      try {
        const r = await fetch("/api/upload?step=social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            slug,
            platform: key,
            caption: plan.caption,
            order: plan.order.map((o) => ({ assetId: o.assetId })),
            heroAssetId: plan.heroAssetId,
          }),
        });
        if (!r.ok) throw new Error(await errorFrom(r, "Post failed"));
        const out = (await r.json()) as { status: string; note?: string };
        setChannels((c) => ({
          ...c,
          [key]: {
            state:
              out.status === "posted"
                ? "done"
                : out.status === "error"
                  ? "error"
                  : "skipped",
            note: out.note,
          },
        }));
      } catch (err) {
        setChannels((c) => ({
          ...c,
          [key]: {
            state: "error",
            note: err instanceof Error ? err.message : "Failed",
          },
        }));
      }
    }
    setSocialBusy(false);
  }

  if (status === "review" && plan) {
    return (
      <ReviewScreen
        plan={plan}
        onPlanChange={setPlan}
        onPost={() => publish(false)}
        onSiteOnly={() => publish(true)}
        onBack={() => setStatus("idle")}
      />
    );
  }

  if (status === "done" && result) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-5 py-16 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="text-2xl font-bold text-navy-900">Job posted live</h1>
        <p className="text-slate-600">
          <strong>{result.title}</strong> is now on your project gallery.
        </p>

        {/* Social is never stranded. Whether the run was skipped, interrupted,
            or a platform threw, there is always a button here to send it —
            the job's photos and caption are still in state. */}
        {result.id && plan && !plan.hold && (
          <button
            type="button"
            disabled={socialBusy}
            onClick={() =>
              runSocial(
                result.id!,
                result.slug ?? "",
                SOCIAL_PLATFORMS.map((p) => p.key).filter(
                  (k) => channels[k]?.state !== "done",
                ),
              )
            }
            className="rounded-full bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {socialBusy
              ? "Posting…"
              : Object.keys(channels).length === 0
                ? "Post to social"
                : "Retry the ones that didn't post"}
          </button>
        )}

        {/* Per-platform outcome, live. The website succeeding used to be the
            only thing reported, so three silent social failures looked exactly
            like a clean run (2026-07-31). */}
        {Object.keys(channels).length > 0 && (
          <ul className="divide-y divide-border rounded-2xl border border-border text-left">
            {SOCIAL_PLATFORMS.map((p) => {
              const c = channels[p.key];
              if (!c) return null;
              const mark =
                c.state === "done"
                  ? "✓"
                  : c.state === "error"
                    ? "✕"
                    : c.state === "working"
                      ? "…"
                      : "–";
              const tone =
                c.state === "done"
                  ? "text-emerald-600"
                  : c.state === "error"
                    ? "text-red-600"
                    : "text-slate-400";
              return (
                <li key={p.key} className="flex items-start gap-2.5 px-4 py-2.5">
                  <span className={`font-bold ${tone}`}>{mark}</span>
                  <span className="text-sm">
                    <span className="font-semibold text-navy-900">
                      {p.label}
                    </span>
                    {c.note && (
                      <span className="text-slate-500"> — {c.note}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {result.reviewRequest && (
          <div className="rounded-2xl border border-border bg-secondary/50 p-5 text-left">
            <p className="text-sm font-semibold text-navy-900">
              Ask this customer for a review
            </p>
            {result.reviewRequest.emailSent && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                ✓ Review request emailed automatically.
              </p>
            )}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {result.reviewRequest.smsHref && (
                <a
                  href={result.reviewRequest.smsHref}
                  className="flex-1 rounded-full bg-navy-900 px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Text the customer
                </a>
              )}
              {result.reviewRequest.mailtoHref && (
                <a
                  href={result.reviewRequest.mailtoHref}
                  className="flex-1 rounded-full border border-border bg-white px-5 py-2.5 text-center text-sm font-semibold text-navy-900"
                >
                  Email the customer
                </a>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={result.url}
            className="rounded-full bg-navy-900 px-6 py-3 font-semibold text-white"
          >
            View gallery
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setResult(null);
              setFiles({ before: [], progress: [], after: [] });
              setDescription("");
              setDetails({});
              setCustomerName("");
              setCustomerEmail("");
              setCustomerPhone("");
            }}
            className="rounded-full border border-border px-6 py-3 font-semibold text-navy-900"
          >
            Post another job
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Upload a Job</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add photos and a few details. It posts straight to your project gallery.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        {/* Job type */}
        <Field label="Job type" required>
          <select
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              setDetails({});
            }}
            className={inputClass}
            required
          >
            <option value="">Select a job type…</option>
            {JOB_TYPES.map((j) => (
              <option key={j.value} value={j.value}>
                {j.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Conditional detail fields */}
        {activeJob && activeJob.fields.length > 0 && (
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-secondary/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-steel-500">
              {activeJob.label} details
            </p>
            {activeJob.fields.map((field) => (
              <DetailInput
                key={field.key}
                field={field}
                value={details[field.key]}
                onChange={(v) => setDetail(field.key, v)}
                onToggle={(opt) => toggleMulti(field.key, opt)}
              />
            ))}
          </div>
        )}

        {/* Channel */}
        <Field label="Property type" required>
          <div className="flex gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setChannel(c.value)}
                className={pillClass(channel === c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        {/* City */}
        <Field label="City" required>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} required>
            <option value="">Select the city…</option>
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {city === OTHER_CITY && (
            <input
              type="text"
              value={cityCustom}
              onChange={(e) => setCityCustom(e.target.value)}
              placeholder="Type the city"
              className={`${inputClass} mt-2`}
            />
          )}
        </Field>

        {/* Photos */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-steel-500">Photos</p>
          {PHASES.map((phase) => (
            <PhotoInput
              key={phase.key}
              label={phase.label}
              blurb={phase.blurb}
              count={files[phase.key].length}
              onChange={(list) => setPhaseFiles(phase.key, list)}
            />
          ))}
        </div>

        {/* Description */}
        <Field label="Job description" hint="Anything notable — the system reads this to add gallery filters.">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. Full tear-off, storm/insurance claim, 2-story, replaced rotted decking…"
            className={inputClass}
          />
        </Field>

        {/* Customer contact — optional, powers the auto review request */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-steel-500">
              Customer (optional)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Add the customer&apos;s email and/or phone to automatically ask
              them for a Google review after posting.
            </p>
          </div>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            className={inputClass}
          />
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Customer email (we'll email them the review link)"
            className={inputClass}
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Customer phone (for a one-tap text)"
            className={inputClass}
          />
        </div>

        {/* Featured */}
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy-900">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          Feature on homepage
        </label>

        {message && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === "working"}
          className="rounded-full bg-navy-900 px-6 py-4 text-base font-semibold text-white disabled:opacity-60"
        >
          {status === "working" ? progress || "Working…" : "Post job to gallery"}
        </button>
      </form>

      <ConnectionsPanel />
    </main>
  );
}

/* ---------- review screen ---------- */

function cx(...parts: string[]): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Promote a photo to cover. On a showcase post the cover IS slide one, so the
 * carousel reorders too. On a reveal the "before" deliberately leads, so this
 * only changes the hero — the single photo Google and the map pin use.
 */
function withHero(plan: SocialPlanView, assetId: string): SocialPlanView {
  const next = { ...plan, heroAssetId: assetId, heroNote: "you picked this one" };
  if (plan.shape !== "showcase") return next;
  const chosen = plan.order.find((p) => p.assetId === assetId);
  if (!chosen) return next;
  return {
    ...next,
    order: [chosen, ...plan.order.filter((p) => p.assetId !== assetId)],
  };
}

/**
 * The last look before anything posts. Shows the cover photo, the carousel in
 * order, what was left off and why, and the caption — all editable. Built after
 * a Facebook post went out with five plywood shots in front of the words
 * "another quality roof installed": the rules below are good, but the owner
 * still gets the final say.
 */
function ReviewScreen({
  plan,
  onPlanChange,
  onPost,
  onSiteOnly,
  onBack,
}: {
  plan: SocialPlanView;
  onPlanChange: (p: SocialPlanView) => void;
  onPost: () => void;
  onSiteOnly: () => void;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-5 px-5 py-10">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          {plan.hold ? "Website only" : "Check the post"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">{plan.reason}</p>
      </div>

      {plan.hold ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Every photo still goes on the website. Nothing will be posted to
          social, because there is no finished roof to lead with — add an
          after photo if you want this one to go out.
        </div>
      ) : (
        <>
          <section>
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Cover photo — what people see in the feed
            </p>
            <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={plan.order[0]?.url}
                alt="Cover"
                className="max-h-64 w-full object-cover"
              />
            </div>
            {plan.heroNote && (
              <p className="mt-1.5 text-xs text-slate-500">
                Google gets the best finished shot — {plan.heroNote}.
              </p>
            )}
          </section>

          <section>
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Carousel order ({plan.order.length})
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {plan.order.map((p, i) => (
                <button
                  key={p.assetId}
                  type="button"
                  disabled={p.phase !== "after"}
                  onClick={() => onPlanChange(withHero(plan, p.assetId))}
                  className={cx(
                    "relative flex-none rounded-lg",
                    p.assetId === plan.heroAssetId
                      ? "ring-2 ring-navy-900 ring-offset-2"
                      : "",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`Slide ${i + 1}`}
                    className="size-20 rounded-lg object-cover"
                  />
                  <span className="absolute top-1 left-1 rounded-full bg-navy-950/75 px-1.5 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="absolute right-1 bottom-1 rounded-full bg-navy-950/75 px-1.5 text-[10px] font-semibold text-white">
                    {PHASE_CHIP[p.phase]}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Tap any finished photo to make it the cover.
            </p>
          </section>

          {plan.omitted.length > 0 && (
            <section>
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Not posted — on the website only ({plan.omitted.length})
              </p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {plan.omitted.map((p) => (
                  <div key={p.assetId} className="relative flex-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt="Not posted"
                      className="size-14 rounded-lg object-cover opacity-50"
                    />
                    <span className="absolute right-0.5 bottom-0.5 rounded-full bg-navy-950/75 px-1 text-[9px] font-semibold text-white">
                      {PHASE_CHIP[p.phase]}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section>
        <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
          Caption
        </p>
        <textarea
          value={plan.caption}
          onChange={(e) => onPlanChange({ ...plan, caption: e.target.value })}
          rows={9}
          className={`${inputClass} mt-2 leading-relaxed`}
        />
      </section>

      <div className="flex flex-col gap-2.5">
        {!plan.hold && (
          <button
            type="button"
            onClick={onPost}
            className="rounded-full bg-navy-900 px-6 py-4 text-base font-semibold text-white"
          >
            Post it
          </button>
        )}
        {/* Deliberately a plain link, not a second button. When both were
            bordered buttons stacked together, the skip was one mis-tap away
            from the thing you actually meant to do. */}
        <button
          type="button"
          onClick={onSiteOnly}
          className={
            plan.hold
              ? "rounded-full bg-navy-900 px-6 py-4 text-base font-semibold text-white"
              : "py-2 text-sm font-medium text-slate-500 underline underline-offset-4"
          }
        >
          {plan.hold ? "Add to the website" : "Website only — skip social"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="py-2 text-sm font-semibold text-slate-500"
        >
          Back to the form
        </button>
      </div>
    </main>
  );
}

/* ---------- connections panel ---------- */

interface CheckResult {
  meta?: {
    configured: boolean;
    igUserIdPresent: boolean;
    pageTokenResolves?: boolean;
    pageName?: string;
    igAccountResolves?: boolean;
    igUsername?: string;
    note?: string;
  };
  metricool?: {
    tokenPresent: boolean;
    userIdPresent: boolean;
    blogIdPresent: boolean;
    galleryAutoPost: boolean;
  };
  gbp?: { configured: boolean; autoPost: boolean };
  anthropicKeyPresent?: boolean;
  error?: string;
}

type Health = "ok" | "warn" | "off";

function Dot({ state }: { state: Health }) {
  const cls =
    state === "ok"
      ? "bg-emerald-500"
      : state === "warn"
        ? "bg-amber-500"
        : "bg-slate-300";
  // block, not inline — an inline span ignores width/height and the dot vanishes.
  return (
    <span
      className={`mt-[7px] block size-2.5 shrink-0 rounded-full ${cls}`}
      aria-hidden="true"
    />
  );
}

function Row({
  label,
  state,
  detail,
}: {
  label: string;
  state: Health;
  detail: string;
}) {
  return (
    <li className="flex items-start gap-2.5 py-1.5">
      <Dot state={state} />
      <span className="text-sm">
        <span className="font-semibold text-navy-900">{label}</span>
        <span className="text-slate-500"> — {detail}</span>
      </span>
    </li>
  );
}

/**
 * Where each social connection actually stands, on the phone, behind the same
 * passphrase as the form. Built after a job posted to Facebook but silently
 * missed Instagram, Google, and TikTok: a failed post and a never-configured
 * one looked identical from the outside.
 */
function ConnectionsPanel() {
  const [data, setData] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/upload?step=check");
      const text = await res.text();
      try {
        setData(JSON.parse(text));
      } catch {
        setData({ error: `HTTP ${res.status}: ${text.slice(0, 200)}` });
      }
    } catch (err) {
      setData({ error: err instanceof Error ? err.message : "Check failed" });
    }
    setLoading(false);
  }

  const meta = data?.meta;
  const mc = data?.metricool;
  const metricoolOn = Boolean(
    mc?.tokenPresent && mc?.userIdPresent && mc?.blogIdPresent,
  );

  return (
    <section className="mt-10 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-navy-900">Connections</h2>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-navy-900 disabled:opacity-60"
        >
          {loading ? "Checking…" : data ? "Re-check" : "Check now"}
        </button>
      </div>

      {!data && !loading && (
        <p className="mt-2 text-xs text-slate-500">
          Tap to see which platforms a new job will actually reach.
        </p>
      )}

      {data?.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {data.error}
        </p>
      )}

      {data && !data.error && (
        <>
          <ul className="mt-3 divide-y divide-border">
            <Row
              label="Facebook"
              state={
                !meta?.configured
                  ? "off"
                  : meta.pageTokenResolves
                    ? "ok"
                    : "warn"
              }
              detail={
                !meta?.configured
                  ? "not connected"
                  : meta.pageTokenResolves
                    ? `posting as ${meta.pageName ?? "your Page"}`
                    : (meta.note ?? "token did not resolve")
              }
            />
            <Row
              label="Instagram"
              state={
                !meta?.igUserIdPresent
                  ? "off"
                  : meta.igAccountResolves
                    ? "ok"
                    : "warn"
              }
              detail={
                !meta?.igUserIdPresent
                  ? "account ID not set — skipped every post"
                  : meta.igAccountResolves
                    ? `posting as @${meta.igUsername}`
                    : (meta.note ?? "account did not resolve")
              }
            />
            <Row
              label="Google Business Profile"
              state={
                data.gbp?.autoPost ? "ok" : data.gbp?.configured ? "warn" : "off"
              }
              detail={
                data.gbp?.autoPost
                  ? "direct posting live"
                  : data.gbp?.configured
                    ? "signed in, but account/location IDs missing"
                    : metricoolOn
                      ? "direct API off — relying on Metricool"
                      : "not connected"
              }
            />
            <Row
              label="TikTok"
              state={metricoolOn ? "ok" : "off"}
              detail={
                metricoolOn
                  ? "via Metricool (slideshow video)"
                  : "Metricool not connected"
              }
            />
            <Row
              label="Caption writer"
              state={data.anthropicKeyPresent ? "ok" : "warn"}
              detail={
                data.anthropicKeyPresent
                  ? "AI captions on"
                  : "no key — using the plain template"
              }
            />
          </ul>

          <button
            type="button"
            onClick={() => setRaw((r) => !r)}
            className="mt-3 text-xs font-semibold text-steel-500 underline-offset-4 hover:underline"
          >
            {raw ? "Hide" : "Show"} raw details
          </button>
          {raw && (
            <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </>
      )}
    </section>
  );
}

/* ---------- small presentational helpers ---------- */

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-navy-900 outline-none focus:border-steel-500";

function pillClass(active: boolean) {
  return `flex-1 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
    active ? "border-navy-900 bg-navy-900 text-white" : "border-border bg-white text-slate-600"
  }`;
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-navy-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {hint && <span className="-mt-1 text-xs text-slate-500">{hint}</span>}
      {children}
    </label>
  );
}

function DetailInput({
  field,
  value,
  onChange,
  onToggle,
}: {
  field: DetailField;
  value: DetailValue | undefined;
  onChange: (v: string) => void;
  onToggle: (option: string) => void;
}) {
  if (field.kind === "multi") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-navy-900">{field.label}</span>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={pillClass(selected.includes(opt))}
              style={{ flex: "0 1 auto" }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (field.kind === "select") {
    return (
      <Field label={field.label}>
        <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>
    );
  }
  return (
    <Field label={field.label}>
      <input
        type="text"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
      />
    </Field>
  );
}

function PhotoInput({
  label,
  blurb,
  count,
  onChange,
}: {
  label: string;
  blurb: string;
  count: number;
  onChange: (list: FileList | null) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-white px-4 py-4">
      <div>
        <span className="block text-sm font-semibold text-navy-900">{label}</span>
        <span className="block text-xs text-slate-500">
          {count > 0 ? `${count} photo${count === 1 ? "" : "s"} selected` : blurb}
        </span>
      </div>
      <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-navy-900">
        {count > 0 ? "Change" : "Add"}
      </span>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onChange(e.target.files)}
        className="hidden"
      />
    </label>
  );
}
