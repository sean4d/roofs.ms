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
  const [details, setDetails] = useState<Record<string, DetailValue>>({});
  const [files, setFiles] = useState<Files>({ before: [], progress: [], after: [] });

  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ title: string; url: string; caption?: string } | null>(null);

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
    };

    try {
      const media: unknown[] = [];
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
          if (!res.ok) throw new Error((await res.json()).error ?? "Photo upload failed");
          media.push(await res.json());
          done++;
        }
      }

      setProgress("Publishing to your gallery…");
      const res = await fetch("/api/upload?step=create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission, media }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Publish failed");
      const data = await res.json();
      setResult({ title: data.title, url: data.url, caption: data.caption });
      setStatus("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done" && result) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-5 py-16 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="text-2xl font-bold text-navy-900">Job posted live</h1>
        <p className="text-slate-600">
          <strong>{result.title}</strong> is now on your project gallery.
        </p>
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
    </main>
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
