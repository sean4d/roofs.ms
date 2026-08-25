"use client";

import { useMemo, useState } from "react";
import { Check, ImageIcon, Loader2, Upload, X } from "lucide-react";

import { GROUPS, SLOTS } from "@/lib/uploads/slots";
import { humanSize } from "@/lib/uploads/config";
import { prepareForUpload } from "@/lib/uploads/prepare";
import { cn } from "@/lib/utils";

/**
 * Photo upload studio.
 *
 * Pick files, assign each one to a slot, send. Each file is committed into the
 * repository, so no bucket and no extra service is involved. Deliberately not
 * pretty-pretty: it is an internal tool and the job is that it works on a
 * phone in a driveway.
 */

interface Item {
  file: File;
  slot: string;
  status: "idle" | "sending" | "done" | "error";
  message?: string;
  preview: string;
}

export function UploadStudio() {
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  const grouped = useMemo(
    () =>
      GROUPS.map((g) => ({
        group: g,
        slots: SLOTS.filter((s) => s.group === g),
      })),
    [],
  );

  const add = (files: FileList | null) => {
    if (!files?.length) return;
    setItems((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        file,
        slot: "",
        status: "idle" as const,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const update = (index: number, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  async function sendAll() {
    if (!password) return;
    setBusy(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.slot || item.status === "done") continue;
      update(i, { status: "sending", message: undefined });

      try {
        // Resize before sending: a raw phone photo is larger than a function
        // request body is allowed to be.
        const prepared = await prepareForUpload(item.file);

        const body = new FormData();
        body.append("password", password);
        body.append("slot", item.slot);
        body.append("file", prepared.file);

        const res = await fetch("/api/studio/upload", { method: "POST", body });

        // A body rejected by the platform comes back as HTML, not our JSON.
        const data = await res.json().catch(() => null);
        if (!data) {
          update(i, {
            status: "error",
            message:
              res.status === 413
                ? "That photo is too large to send. Try a smaller file."
                : `Upload failed (${res.status}).`,
          });
          continue;
        }

        update(i, {
          status: res.ok ? "done" : "error",
          message: res.ok
            ? [prepared.note, data.path].filter(Boolean).join(" ")
            : data.error,
        });
      } catch (error) {
        update(i, {
          status: "error",
          message: error instanceof Error ? error.message : "Failed",
        });
      }
    }

    setBusy(false);
  }

  const ready = items.filter((i) => i.slot && i.status !== "done").length;
  const taken = new Set(
    items.filter((i) => i.status === "done").map((i) => i.slot),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="pw" className="text-bone-200 text-sm font-medium">
          Passphrase
        </label>
        <input
          id="pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full max-w-sm rounded-lg border border-white/12 bg-white/[0.03] px-4 py-3 text-bone-100 focus:border-champagne-400/60 focus:outline-none"
        />
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-card border border-dashed border-white/15 px-6 py-10 text-bone-300 hover:border-champagne-400/50 hover:text-bone-100">
        <Upload className="size-5" strokeWidth={1.5} />
        <span>
          <span className="font-medium text-champagne-300">Choose photos</span>
          <span className="hidden sm:inline"> or drop them here</span>
        </span>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
          className="sr-only"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {items.map((item, index) => (
            <li
              key={`${item.file.name}-${index}`}
              className="flex flex-col gap-4 rounded-card border border-white/[0.09] p-4 sm:flex-row sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.preview}
                alt=""
                className="h-24 w-full rounded-lg object-cover sm:w-32"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-bone-100">
                  {item.file.name}
                </p>
                <p className="mt-0.5 text-xs text-bone-500">
                  {humanSize(item.file.size)}
                </p>

                <select
                  value={item.slot}
                  onChange={(e) => update(index, { slot: e.target.value })}
                  aria-label={`Slot for ${item.file.name}`}
                  className="mt-3 w-full rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm text-bone-100 focus:border-champagne-400/60 focus:outline-none"
                >
                  <option value="">Where should this go?</option>
                  {grouped.map(({ group, slots }) => (
                    <optgroup key={group} label={group}>
                      {slots.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}: {s.where}
                          {taken.has(s.key) ? " (uploaded)" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {item.message ? (
                  <p
                    className={cn(
                      "mt-2 text-xs",
                      item.status === "error"
                        ? "text-brand-300"
                        : "text-champagne-300",
                    )}
                  >
                    {item.message}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {item.status === "sending" ? (
                  <Loader2 className="size-5 animate-spin text-champagne-400" />
                ) : item.status === "done" ? (
                  <Check
                    className="size-5 text-emerald-400"
                    strokeWidth={2.5}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${item.file.name}`}
                    className="rounded p-2 text-bone-500 hover:text-brand-300"
                  >
                    <X className="size-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 text-sm text-bone-500">
          <ImageIcon className="size-4" strokeWidth={1.5} />
          Nothing queued yet.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={sendAll}
          disabled={busy || !password || ready === 0}
          className="btn-primary disabled:opacity-50"
        >
          {busy
            ? "Uploading..."
            : `Upload ${ready || ""} photo${ready === 1 ? "" : "s"}`}
        </button>
        <p className="text-sm text-bone-500">
          Files commit straight into the repo. Tell Claude when you are done and
          they will be processed and deployed.
        </p>
      </div>
    </div>
  );
}
