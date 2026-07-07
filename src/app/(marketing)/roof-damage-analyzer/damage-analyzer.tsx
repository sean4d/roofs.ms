"use client";

import { useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  AlertTriangle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PhoneCall,
} from "lucide-react";

import { submitLead, type LeadFormState } from "@/lib/actions/lead";
import type { DamageIssue, DamageResult } from "@/lib/ai/damage-analyzer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const ISSUES: { value: DamageIssue; label: string }[] = [
  { value: "missing-shingles", label: "Missing shingles" },
  { value: "leak", label: "A leak" },
  { value: "hail", label: "Hail" },
  { value: "wind", label: "Wind" },
  { value: "tree-damage", label: "Tree / impact" },
  { value: "pipe-boot-leak", label: "Pipe boot leak" },
  { value: "rusted-metal", label: "Rusted metal" },
  { value: "commercial-ponding", label: "Ponding water (flat roof)" },
  { value: "not-sure", label: "Not sure" },
];

const WHEN = ["This week", "1–4 weeks ago", "Over a month ago", "Not sure"];
const INSURANCE = ["Yes", "No", "Not sure"];
const STAGES = ["Reviewing your photos & notes", "Identifying likely damage", "Gauging urgency", "Preparing your next step"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const initialState: LeadFormState = { status: "idle" };

type Phase = "intake" | "details" | "analyzing" | "result";

export function DamageAnalyzer() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("intake");
  const [files, setFiles] = useState<File[]>([]);
  const [issue, setIssue] = useState<DamageIssue | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [when, setWhen] = useState("");
  const [insurance, setInsurance] = useState("");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<DamageResult | null>(null);
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  useEffect(() => {
    track("tool_opened", { tool: "damage-analyzer" });
  }, []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
    if (imgs.length) track("image_uploaded", { tool: "damage-analyzer", count: imgs.length });
  }

  async function analyze() {
    if (!issue) return;
    setPhase("analyzing");
    setStage(0);
    const req = fetch("/api/damage-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue, when, insurance, photoCount: files.length }),
    }).then((r) => r.json() as Promise<DamageResult>);
    for (let i = 0; i < STAGES.length; i++) {
      await sleep(650);
      setStage(i + 1);
    }
    setResult(await req);
    setPhase("result");
    track("analysis_completed", { tool: "damage-analyzer", issue });
  }

  if (state.status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-bold text-navy-900">Got it — we&apos;re on it</h2>
        <p className="mt-2 text-slate-600">
          Thanks! We&apos;ll reach out shortly to set up your free inspection. Have your
          photos handy to show our inspector. Urgent?{" "}
          <a href={`tel:${siteConfig.phone.tel}`} className="font-semibold text-navy-900">
            Call {siteConfig.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const summary = `issue: ${issue}; when: ${when || "n/a"}; insurance: ${insurance || "n/a"}; photos: ${files.length}${result ? `; read: ${result.damageType} (${result.urgency})` : ""}`;

  return (
    <div className="mx-auto max-w-2xl">
      {phase === "intake" && (
        <div className="rounded-2xl border border-border bg-white p-6">
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-8 text-center"
          >
            <ImagePlus className="size-7 text-steel-500" />
            <span className="font-semibold text-navy-900">
              {files.length > 0 ? `${files.length} photo${files.length === 1 ? "" : "s"} added` : "Upload photos of the damage"}
            </span>
            <span className="text-xs text-slate-500">Tap to browse or drag &amp; drop (optional)</span>
            <input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} className="hidden" />
          </label>

          <p className="mt-6 text-sm font-semibold text-navy-900">What are you seeing?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ISSUES.map((i) => (
              <Chip
                key={i.value}
                active={issue === i.value}
                onClick={() => {
                  setIssue(i.value);
                  track("issue_selected", { tool: "damage-analyzer", issue: i.value });
                }}
              >
                {i.label}
              </Chip>
            ))}
          </div>

          <button
            type="button"
            disabled={!issue}
            onClick={() => setPhase("details")}
            className="mt-6 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {phase === "details" && (
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="City" value={city} onChange={setCity} placeholder="e.g. Hattiesburg" />
            <Field label="Property address" value={address} onChange={setAddress} placeholder="Street address" />
          </div>
          <p className="mt-5 text-sm font-semibold text-navy-900">When did it happen?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {WHEN.map((w) => (
              <Chip key={w} active={when === w} onClick={() => setWhen(w)}>
                {w}
              </Chip>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-navy-900">Is insurance involved?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {INSURANCE.map((v) => (
              <Chip key={v} active={insurance === v} onClick={() => setInsurance(v)}>
                {v}
              </Chip>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={analyze} className="rounded-full bg-navy-900 px-6 py-3 font-semibold text-white">
              Analyze my roof
            </button>
            <button type="button" onClick={() => setPhase("intake")} className="rounded-full border border-border px-5 py-3 font-semibold text-navy-900">
              Back
            </button>
          </div>
        </div>
      )}

      {phase === "analyzing" && (
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="mb-4 font-semibold text-navy-900">Analyzing…</p>
          <ul className="flex flex-col gap-3">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                {i < stage ? <CheckCircle2 className="size-5 text-emerald-600" /> : i === stage ? <Loader2 className="size-5 animate-spin text-steel-500" /> : <span className="size-5 rounded-full border border-border" />}
                <span className={cn("text-sm", i <= stage ? "text-navy-900" : "text-slate-400")}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === "result" && result && (
        <div>
          <div className="rounded-2xl border border-border bg-secondary/50 p-6">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                result.urgency === "high" ? "bg-red-50 text-red-700" : result.urgency === "moderate" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700",
              )}
            >
              <AlertTriangle className="size-3.5" />
              {result.urgency === "high" ? "Time-sensitive" : result.urgency === "moderate" ? "Worth addressing" : "No rush"}
            </span>
            <h2 className="mt-3 text-xl font-bold text-navy-900">{result.damageType}</h2>
            <p className="mt-2 text-slate-700">{result.urgencyNote}</p>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-semibold text-navy-900">Suggested next step:</span> {result.nextStep}
            </p>
          </div>

          {/* Lead capture */}
          <form action={formAction} className="mt-6 rounded-2xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-navy-900">Get your free inspection</h3>
            <p className="mt-1 text-sm text-slate-600">We&apos;ll confirm the damage in person, no obligation.</p>

            <input type="hidden" name="source" value="damage-analyzer" />
            <input type="hidden" name="storm" value="on" />
            <input type="hidden" name="service" value="Storm damage / roof damage" />
            <input type="hidden" name="page" value={pathname} />
            <input type="hidden" name="city" value={city} />
            <input type="hidden" name="address" value={address} />
            <input type="hidden" name="message" value={`Damage analyzer — ${summary}`} />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <LeadField name="name" label="Name" error={state.errors?.name} />
              <LeadField name="phone" label="Phone" type="tel" error={state.errors?.phone} />
              <LeadField name="email" label="Email (optional)" type="email" error={state.errors?.email} />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-navy-900">Preferred contact</span>
                <select name="preferredTime" className="rounded-xl border border-border bg-white px-4 py-2.5 outline-none focus:border-steel-500">
                  <option>Call</option>
                  <option>Text</option>
                  <option>Email</option>
                </select>
              </label>
            </div>

            {state.status === "error" && state.message && (
              <p className="mt-3 text-sm text-red-600">{state.message}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={pending}
                onClick={() => track("cta_click", { action: "submit-lead", source: "damage-analyzer" })}
                className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                Schedule free inspection
              </button>
              {siteConfig.phone.tel && (
                <a
                  href={`tel:${siteConfig.phone.tel}`}
                  onClick={() => track("cta_click", { action: "call-now", source: "damage-analyzer" })}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold text-navy-900"
                >
                  <PhoneCall className="size-4" /> Call now
                </a>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              This is a preliminary, automated read — it does not replace a professional
              roof inspection. Bring your photos to your inspection so we can review them
              with you.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
        active ? "border-navy-900 bg-navy-900 text-white" : "border-border bg-white text-slate-600 hover:border-steel-500",
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-white px-4 py-2.5 outline-none focus:border-steel-500"
      />
    </label>
  );
}

function LeadField({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <input name={name} type={type} className="rounded-xl border border-border bg-white px-4 py-2.5 outline-none focus:border-steel-500" />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
