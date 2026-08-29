"use client";

import { useState } from "react";

import type { CompanyProfile } from "@/lib/quotes/profile";

/**
 * The template editor.
 *
 * Grouped the way somebody thinks about it rather than the way the table is
 * laid out: who we are, what makes us credible, how the document reads, and
 * what appears on it. The logo sits at the top because it is the change people
 * come here to make.
 *
 * Every field shows its current value and saving a blank reverts to the
 * built-in, which is written on the page. That matters more than it sounds:
 * the failure mode of an editor like this is somebody clearing a box, sending
 * a proposal with no phone number on it, and not finding out for a week.
 */
export function SettingsForm({ profile }: { profile: CompanyProfile }) {
  const [form, setForm] = useState(profile);
  /**
   * The credential list is edited as ONE STRING, not as an array.
   *
   * It used to split on newlines and trim every line on each keystroke, then
   * re-join for the textarea's value. Trimming changes the string, so React
   * wrote a different value back into the DOM than the one being typed, and
   * the caret jumped to the end of the box on every character. The symptom
   * was that a new line could only ever be added at the bottom, which is
   * exactly what the owner hit trying to put GAF under BBB.
   *
   * So the raw text is the state, and it is only split and trimmed on save.
   */
  const [credentialsText, setCredentialsText] = useState(
    profile.credentials.join("\n"),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrated, setMigrated] = useState<string | null>(null);

  const set = <K extends keyof CompanyProfile>(
    key: K,
    value: CompanyProfile[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  /**
   * Read the logo in the browser and send it as a data URI.
   *
   * Base64 inflates by about a third, so the 400KB the server accepts is
   * roughly a 290KB file. That is a very large logo, and checking here means
   * somebody who picks a 4MB photograph is told immediately rather than after
   * a slow upload fails.
   */
  function readLogo(file: File) {
    if (file.size > 290_000) {
      setError("That image is too big. Use one under about 290KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("logoDataUri", String(reader.result));
      setError(null);
    };
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsDataURL(file);
  }

  /**
   * Apply the schema that shipped with this deployment.
   *
   * Migrations used to need somebody with the database URL on a laptop, which
   * meant a feature could go live before its columns existed and the failure
   * showed up as a 500 in front of a customer. This runs the committed
   * schema.sql and nothing else: there is no way to hand it a statement.
   */
  async function migrate() {
    setMigrating(true);
    setError(null);
    setMigrated(null);
    try {
      const res = await fetch("/api/pin/migrate", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not apply the updates.");
      } else {
        setMigrated(
          `Done. ${data.applied} of ${data.statements} statements applied.`,
        );
      }
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setMigrating(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/pin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalName: form.legalName,
          displayName: form.displayName,
          phone: form.phone,
          email: form.email,
          website: form.website,
          street: form.street,
          city: form.city,
          state: form.state,
          postal: form.postal,
          license: form.license,
          warranty: form.warranty,
          financingLine: form.financingLine,
          credentials: credentialsText
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
          headline: form.headline,
          closingLine: form.closingLine,
          accentColor: form.accentColor,
          logoDataUri: form.logoDataUri,
          showStorms: form.showStorms,
          showInsurance: form.showInsurance,
          showFinancing: form.showFinancing,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save.");
      } else {
        setMessage("Saved. Every estimate from now on uses these.");
      }
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <Group title="Logo and colour">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2">
            {form.logoDataUri ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={form.logoDataUri}
                alt="Your logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-center text-[10px] text-slate-400">
                Built-in mark
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readLogo(f);
              }}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#123b63] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white"
            />
            {form.logoDataUri && (
              <button
                onClick={() => set("logoDataUri", null)}
                className="mt-2 text-xs text-slate-500 underline underline-offset-2"
              >
                Remove and use the built-in mark
              </button>
            )}
          </div>
        </div>
        <Field
          label="Accent colour"
          hint="Hex, like #123b63. Used for headings, the price block and the QR."
          value={form.accentColor}
          onChange={(v) => set("accentColor", v)}
        />
      </Group>

      <Group title="Who we are">
        <Field
          label="Legal name"
          value={form.legalName}
          onChange={(v) => set("legalName", v)}
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(v) => set("email", v)}
        />
        <Field
          label="Website"
          value={form.website}
          onChange={(v) => set("website", v)}
        />
        <Field
          label="Street"
          value={form.street}
          onChange={(v) => set("street", v)}
        />
        <div className="grid grid-cols-3 gap-2">
          <Field
            label="City"
            value={form.city}
            onChange={(v) => set("city", v)}
          />
          <Field
            label="State"
            value={form.state}
            onChange={(v) => set("state", v)}
          />
          <Field
            label="ZIP"
            value={form.postal}
            onChange={(v) => set("postal", v)}
          />
        </div>
        <Field
          label="License number"
          value={form.license}
          onChange={(v) => set("license", v)}
        />
      </Group>

      <Group title="What makes us credible">
        <p className="text-xs leading-relaxed text-slate-500">
          One per line. These print as the ticked list under &ldquo;Who you
          would be hiring&rdquo;. Write them exactly as you want a customer to
          read them, because that is a claim they can hold you to.
        </p>
        <textarea
          value={credentialsText}
          onChange={(e) => setCredentialsText(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-[#123b63]"
        />
        <Field
          label="Warranty line"
          value={form.warranty}
          onChange={(v) => set("warranty", v)}
        />
        <Field
          label="Financing line"
          value={form.financingLine}
          onChange={(v) => set("financingLine", v)}
        />
      </Group>

      <Group title="How the estimate closes">
        <Field
          label="Closing headline"
          value={form.headline}
          onChange={(v) => set("headline", v)}
        />
        <div>
          <label className="block text-xs font-bold tracking-wide text-slate-500 uppercase">
            Closing paragraph
          </label>
          <textarea
            value={form.closingLine}
            onChange={(e) => set("closingLine", e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#123b63]"
          />
        </div>
      </Group>

      <Group title="What appears on it">
        <Toggle
          label="Storm history section"
          hint="Confirmed NOAA events near the address. Hidden automatically when there is nothing to show."
          on={form.showStorms}
          onChange={(v) => set("showStorms", v)}
        />
        <Toggle
          label="Financing options"
          hint="Payments at 5, 10 and 15 years with the APR disclosure."
          on={form.showFinancing}
          onChange={(v) => set("showFinancing", v)}
        />
        <Toggle
          label="Insurance claim page"
          hint="The third sheet. Turning it off makes the estimate two pages."
          on={form.showInsurance}
          onChange={(v) => set("showInsurance", v)}
        />
      </Group>

      <Group title="Database">
        <p className="text-xs leading-relaxed text-slate-500">
          New features sometimes need new columns, and a deploy does not add
          them by itself. If something in the tool reports that the database is
          out of date, press this. It applies the schema that shipped with this
          version and is safe to press twice: every statement checks whether the
          thing already exists before creating it.
        </p>
        <button
          onClick={migrate}
          disabled={migrating}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {migrating ? "Applying..." : "Apply database updates"}
        </button>
        {migrated && <p className="text-sm text-green-700">{migrated}</p>}
      </Group>

      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          {error && <p className="flex-1 text-sm text-red-700">{error}</p>}
          {message && !error && (
            <p className="flex-1 text-sm text-green-700">{message}</p>
          )}
          {!error && !message && <span className="flex-1" />}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-[#123b63] px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 font-[family-name:var(--font-archivo)] text-base font-bold text-[#123b63]">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex w-full items-start gap-3 text-left"
    >
      <span
        className={`mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition ${
          on ? "bg-[#123b63]" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition ${on ? "translate-x-4" : ""}`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">
          {label}
        </span>
        <span className="block text-xs leading-relaxed text-slate-500">
          {hint}
        </span>
      </span>
    </button>
  );
}
