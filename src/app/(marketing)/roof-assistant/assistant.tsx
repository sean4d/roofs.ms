"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CloudLightning,
  Droplet,
  FileText,
  HelpCircle,
  Home,
  ImagePlus,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  Wrench,
} from "lucide-react";

import type { AssistantResult, RoofTopic } from "@/lib/ai/roof-assistant";
import { encodeImages } from "@/lib/image-encode";
import { cn } from "@/lib/utils";

const TOPICS: { value: RoofTopic; label: string; icon: React.ElementType }[] = [
  { value: "roof-leak", label: "Roof leak", icon: Droplet },
  { value: "storm-damage", label: "Storm damage", icon: CloudLightning },
  { value: "roof-replacement", label: "Roof replacement", icon: Home },
  { value: "metal-roof", label: "Metal roof", icon: Layers },
  { value: "commercial-roof", label: "Commercial roof", icon: Building2 },
  { value: "insurance-claim", label: "Insurance claim", icon: FileText },
  { value: "maintenance", label: "Maintenance", icon: Wrench },
  { value: "gutters", label: "Gutters", icon: ImagePlus },
  { value: "not-sure", label: "Not sure", icon: HelpCircle },
];

const STAGES = [
  "Reviewing what you told us",
  "Checking common causes",
  "Gauging urgency",
  "Preparing your next step",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = "topic" | "input" | "analyzing" | "result";

export function RoofAssistant() {
  const [phase, setPhase] = useState<Phase>("topic");
  const [topic, setTopic] = useState<RoofTopic | null>(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AssistantResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    track("assistant_opened", { tool: "roof-assistant" });
  }, []);

  function chooseTopic(t: RoofTopic) {
    setTopic(t);
    setPhase("input");
    track("topic_selected", { tool: "roof-assistant", topic: t });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
    if (imgs.length) track("image_uploaded", { tool: "roof-assistant", count: imgs.length });
  }

  async function analyze() {
    if (!topic) return;
    setPhase("analyzing");
    setStage(0);
    const images = files.length ? await encodeImages(files) : [];
    const req = fetch("/api/roof-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, description, photoCount: files.length, images }),
    }).then((r) => r.json() as Promise<AssistantResult>);

    for (let i = 0; i < STAGES.length; i++) {
      await sleep(650);
      setStage(i + 1);
    }
    const res = await req;
    setResult(res);
    setPhase("result");
    track("analysis_completed", { tool: "roof-assistant", topic, urgency: res.urgency });
  }

  function reset() {
    setPhase("topic");
    setTopic(null);
    setDescription("");
    setFiles([]);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Assistant header */}
      <div className="flex items-center gap-3 border-b border-border bg-navy-950 px-5 py-4 text-white">
        <span className="grid size-9 place-items-center rounded-full bg-white/10">
          <Sparkles className="size-5 text-steel-300" />
        </span>
        <div>
          <p className="font-semibold">Roof Assistant</p>
          <p className="text-xs text-steel-300">Quick help from Southeast Roofing</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {phase === "topic" && (
          <>
            <p className="text-navy-900">Hey! What can we help you with today?</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TOPICS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => chooseTopic(t.value)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white px-3 py-4 text-center text-sm font-semibold text-navy-900 transition hover:border-navy-900 hover:bg-secondary"
                >
                  <t.icon className="size-5 text-steel-500" aria-hidden="true" />
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "input" && (
          <>
            <p className="text-navy-900">
              Got it. Add a couple photos or a quick note if you like, both optional, 
              and I&apos;ll point you to the right next step.
            </p>

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-center"
            >
              <ImagePlus className="size-6 text-steel-500" />
              <span className="text-sm font-semibold text-navy-900">
                {files.length > 0
                  ? `${files.length} photo${files.length === 1 ? "" : "s"} added`
                  : "Add photos (optional)"}
              </span>
              <span className="text-xs text-slate-500">Tap to browse or drag &amp; drop</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addFiles(e.target.files)}
                className="hidden"
              />
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Anything you want us to know? (optional)"
              className="mt-3 w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-steel-500"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={analyze}
                className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white"
              >
                <Sparkles className="size-4" /> Get my next step
              </button>
              <button
                type="button"
                onClick={() => setPhase("topic")}
                className="rounded-full border border-border px-5 py-3 font-semibold text-navy-900"
              >
                Back
              </button>
            </div>
          </>
        )}

        {phase === "analyzing" && (
          <div className="py-4">
            <p className="mb-4 font-semibold text-navy-900">Working on it…</p>
            <ul className="flex flex-col gap-3">
              {STAGES.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  {i < stage ? (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  ) : i === stage ? (
                    <Loader2 className="size-5 animate-spin text-steel-500" />
                  ) : (
                    <span className="size-5 rounded-full border border-border" />
                  )}
                  <span className={cn("text-sm", i <= stage ? "text-navy-900" : "text-slate-400")}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {phase === "result" && result && (
          <div>
            <h2 className="text-xl font-bold text-navy-900">{result.headline}</h2>
            <UrgencyBadge urgency={result.urgency} />
            <p className="mt-3 text-slate-700">{result.read}</p>
            <p className="mt-2 text-sm text-slate-600">{result.urgencyNote}</p>

            <p className="mt-5 text-sm font-semibold text-navy-900">Your next steps:</p>
            <ol className="mt-2 flex list-inside list-decimal flex-col gap-1.5 text-sm text-slate-700">
              {result.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap gap-3">
              {result.ctas.map((cta) => (
                <CtaButton key={cta.kind} cta={cta} onPhotos={() => setPhase("input")} />
              ))}
            </div>

            <p className="mt-5 rounded-lg bg-secondary/60 p-3 text-xs text-slate-500">
              This is a quick, automated guide. It does not replace a professional roof
              inspection. For anything urgent, call us any time.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-steel-500 hover:text-navy-900"
            >
              <RotateCcw className="size-4" /> Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: AssistantResult["urgency"] }) {
  const map = {
    high: { label: "Time-sensitive", cls: "bg-red-50 text-red-700", icon: AlertTriangle },
    moderate: { label: "Worth addressing", cls: "bg-amber-50 text-amber-700", icon: AlertTriangle },
    low: { label: "No rush", cls: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  }[urgency];
  return (
    <span className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", map.cls)}>
      <map.icon className="size-3.5" /> {map.label}
    </span>
  );
}

function CtaButton({
  cta,
  onPhotos,
}: {
  cta: AssistantResult["ctas"][number];
  onPhotos: () => void;
}) {
  const base = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold";
  const primary = cta.kind === "inspection";
  const cls = cn(base, primary ? "bg-navy-900 text-white" : "border border-border text-navy-900");
  const fire = () => track("cta_click", { action: cta.kind, source: "roof-assistant" });

  if (!cta.href) {
    return (
      <button type="button" onClick={() => { fire(); onPhotos(); }} className={cls}>
        {cta.label}
      </button>
    );
  }
  if (cta.href.startsWith("/")) {
    return (
      <Link href={cta.href} onClick={fire} className={cls}>
        {cta.label}
      </Link>
    );
  }
  return (
    <a
      href={cta.href}
      onClick={fire}
      target={cta.href.startsWith("http") ? "_blank" : undefined}
      rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {cta.label}
    </a>
  );
}
