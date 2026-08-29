"use client";

import { useRef, useState } from "react";
import { FileText, ImageIcon, Paperclip, X } from "lucide-react";

import { UPLOAD, fileError, humanSize } from "@/lib/uploads/config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Optional file attachments.
 *
 * A commercial buyer should be able to attach a site plan in the form, not be
 * told to submit and then reply to an email. Drag-and-drop on desktop, a plain
 * tap target on mobile, per-file validation before anything is sent, and a
 * removable list so mistakes are fixable.
 */
export function FileUpload({
  files,
  onChange,
  label,
  hint,
  context,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  label: string;
  hint: string;
  context: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const add = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next: File[] = [];
    const problems: string[] = [];

    for (const file of Array.from(incoming)) {
      const problem = fileError(file);
      if (problem) {
        problems.push(problem);
        continue;
      }
      if (files.some((f) => f.name === file.name && f.size === file.size))
        continue;
      next.push(file);
    }

    const combined = [...files, ...next];
    if (combined.length > UPLOAD.maxFiles) {
      problems.push(`You can attach up to ${UPLOAD.maxFiles} files.`);
    }

    setErrors(problems);
    if (next.length) {
      onChange(combined.slice(0, UPLOAD.maxFiles));
      track("upload_started", { context, count: next.length });
    }
  };

  const remove = (index: number) =>
    onChange(files.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-3">
      <div>
        <span className="text-bone-200 text-sm font-medium">
          {label}
          <span className="ml-2 text-xs font-normal text-bone-500">
            Optional
          </span>
        </span>
        <p className="mt-1 text-xs leading-relaxed text-bone-500">{hint}</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-card border border-dashed transition-colors",
          dragging
            ? "border-champagne-400/70 bg-champagne-400/[0.06]"
            : "border-white/15",
        )}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-3 px-5 py-7 text-sm text-bone-300 hover:text-bone-100"
        >
          <Paperclip className="size-4 shrink-0" strokeWidth={1.5} />
          <span>
            <span className="font-medium text-champagne-300">Choose files</span>
            <span className="hidden sm:inline"> or drag them here</span>
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={UPLOAD.acceptAttr}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
          aria-label={label}
        />
      </div>

      <p className="text-xs text-bone-500">
        JPG, PNG, HEIC, WEBP or PDF. Up to {UPLOAD.maxFiles} files,{" "}
        {humanSize(UPLOAD.maxBytes)} each.
      </p>

      {errors.length > 0 ? (
        <ul role="alert" className="flex flex-col gap-1">
          {errors.map((error) => (
            <li key={error} className="text-sm text-brand-300">
              {error}
            </li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => {
            const isPdf = /pdf$/i.test(file.type) || /\.pdf$/i.test(file.name);
            const Icon = isPdf ? FileText : ImageIcon;
            return (
              <li
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-3 rounded-lg border border-white/[0.09] px-4 py-3"
              >
                <Icon
                  className="size-4 shrink-0 text-champagne-400"
                  strokeWidth={1.5}
                />
                <span className="text-bone-200 min-w-0 flex-1 truncate text-sm">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-bone-500">
                  {humanSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${file.name}`}
                  className="-mr-1 shrink-0 rounded p-1.5 text-bone-500 hover:text-brand-300"
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
