"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";

import { submitLead, type LeadFormState } from "@/lib/actions/lead";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  hint?: string;
}
interface Step {
  key: string;
  question: string;
  options: Option[];
  when?: (a: Answers) => boolean;
}
type Answers = Record<string, string>;

const STEPS: Step[] = [
  {
    key: "cause",
    question: "What caused the damage?",
    options: [
      { value: "Wind", label: "Wind" },
      { value: "Hail", label: "Hail" },
      { value: "Fallen tree / impact", label: "Tree or impact" },
      { value: "Leak", label: "A leak" },
      { value: "Not sure", label: "Not sure" },
    ],
  },
  {
    key: "when",
    question: "When did it happen?",
    options: [
      { value: "This week", label: "This week" },
      { value: "1–4 weeks ago", label: "1–4 weeks ago" },
      { value: "Over a month ago", label: "Over a month ago" },
      { value: "Not sure", label: "Not sure" },
    ],
  },
  {
    key: "activeLeak",
    question: "Is there an active leak right now?",
    options: [
      { value: "Yes", label: "Yes — water coming in" },
      { value: "No", label: "No active leak" },
    ],
  },
  {
    key: "filed",
    question: "Have you filed an insurance claim yet?",
    options: [
      { value: "Yes", label: "Yes, filed" },
      { value: "No", label: "Not yet" },
      { value: "Not sure", label: "Not sure how" },
    ],
  },
  {
    key: "status",
    question: "What's the claim status?",
    when: (a) => a.filed === "Yes",
    options: [
      { value: "Pending", label: "Still pending" },
      { value: "Approved", label: "Approved" },
      { value: "Denied", label: "Denied / underpaid" },
    ],
  },
  {
    key: "photos",
    question: "Do you have photos of the damage?",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    key: "tarp",
    question: "Do you need emergency tarp help to stop water now?",
    when: (a) => a.activeLeak === "Yes",
    options: [
      { value: "Yes", label: "Yes, urgent" },
      { value: "No", label: "No, it's contained" },
    ],
  },
];

interface Result {
  key: string;
  heading: string;
  body: string[];
  urgent?: boolean;
}

function computeResult(a: Answers): Result {
  if (a.activeLeak === "Yes" || a.tarp === "Yes") {
    return {
      key: "emergency",
      urgent: true,
      heading: "Let's stop the water first",
      body: [
        "With an active leak, the priority is protecting your home before anything else. Call us now and we can get an emergency tarp on to stop further damage.",
        "Document everything with photos as you go — it all helps your claim. We'll handle the roof; you focus on staying dry.",
      ],
    };
  }
  if (a.filed === "No") {
    return {
      key: "inspect-before-filing",
      heading: "Get a free inspection before you file",
      body: [
        "Smart move to look before you leap. A free Southeast Roofing inspection documents the real damage so you file an accurate, well-supported claim — not a guess.",
        "In Mississippi you generally have time after a storm to file, but don't wait too long. We'll give you honest photos and findings either way.",
      ],
    };
  }
  if (a.filed === "Yes") {
    if (a.status === "Denied") {
      return {
        key: "denied-second-opinion",
        heading: "A denial isn't always the end",
        body: [
          "Claims get denied or underpaid all the time — sometimes because the damage wasn't fully documented. A second, thorough inspection can surface what was missed.",
          "We'll walk your roof, document everything honestly, and help you understand your options for reopening or supplementing the claim.",
        ],
      };
    }
    if (a.status === "Approved") {
      return {
        key: "approved-ready",
        heading: "Approved — let's build your roof",
        body: [
          "Great news. With an approved claim you're ready for the fun part. We'll schedule your inspection and estimate and get your new roof on the calendar.",
          "We work directly with your scope of work so the job matches what your insurance approved.",
        ],
      };
    }
    return {
      key: "already-filed",
      heading: "Claim's in — we'll meet the adjuster",
      body: [
        "With a claim pending, timing matters. We can inspect your roof and, when it helps, meet your adjuster on-site so nothing gets overlooked.",
        "Keep every document and photo. We'll make sure the damage is fully represented.",
      ],
    };
  }
  return {
    key: "guidance",
    heading: "Let's figure it out together",
    body: [
      "No worries if the insurance side is confusing — most homeowners only do this once. Start with a free inspection so you know exactly what you're dealing with.",
      "We'll explain your options in plain English and, if a claim makes sense, help you through it.",
    ],
  };
}

const initialState: LeadFormState = { status: "idle" };

export function InsuranceWizard() {
  const pathname = usePathname();
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  useEffect(() => {
    track("tool_opened", { tool: "insurance-wizard" });
  }, []);

  const applicable = useMemo(
    () => STEPS.filter((s) => !s.when || s.when(answers)),
    [answers],
  );
  const step = applicable[stepIndex];
  const result = useMemo(() => computeResult(answers), [answers]);

  function choose(key: string, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    track("step_completed", { tool: "insurance-wizard", step: key });
    const nextApplicable = STEPS.filter((s) => !s.when || s.when(next));
    if (stepIndex + 1 >= nextApplicable.length) {
      setShowResult(true);
      track("insurance_path_completed", { tool: "insurance-wizard", path: computeResult(next).key });
    } else {
      setStepIndex(stepIndex + 1);
    }
  }

  const summary = Object.entries(answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  if (state.status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-bold text-navy-900">We've got it</h2>
        <p className="mt-2 text-slate-600">
          Thanks — we'll reach out shortly to help with your storm damage and claim. If
          it's urgent, call us anytime at{" "}
          <a href={`tel:${siteConfig.phone.tel}`} className="font-semibold text-navy-900">
            {siteConfig.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="mx-auto max-w-2xl">
        <div
          className={cn(
            "rounded-2xl border p-6 sm:p-8",
            result.urgent ? "border-red-200 bg-red-50" : "border-border bg-secondary/50",
          )}
        >
          <div className="flex items-center gap-2">
            {result.urgent ? (
              <ShieldAlert className="size-5 text-red-600" />
            ) : (
              <CheckCircle2 className="size-5 text-navy-900" />
            )}
            <h2 className="text-xl font-bold text-navy-900">{result.heading}</h2>
          </div>
          {result.body.map((p) => (
            <p key={p} className="mt-3 text-slate-700">
              {p}
            </p>
          ))}
          {result.urgent && siteConfig.phone.tel && (
            <a
              href={`tel:${siteConfig.phone.tel}`}
              onClick={() => track("cta_click", { action: "call-now", source: "insurance-wizard" })}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white"
            >
              <PhoneCall className="size-4" /> Call now — {siteConfig.phone.display}
            </a>
          )}
        </div>

        {/* Lead capture */}
        <form action={formAction} className="mt-6 rounded-2xl border border-border bg-white p-6">
          <h3 className="text-lg font-bold text-navy-900">
            Get your free inspection & claim help
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Tell us where to reach you. No obligation.
          </p>

          {/* Hidden context */}
          <input type="hidden" name="source" value="insurance-wizard" />
          <input type="hidden" name="storm" value="on" />
          <input type="hidden" name="service" value="Storm damage / insurance claim" />
          <input type="hidden" name="page" value={pathname} />
          <input type="hidden" name="message" value={`Insurance claim wizard — ${summary}`} />
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field name="name" label="Name" error={state.errors?.name} />
            <Field name="phone" label="Phone" type="tel" error={state.errors?.phone} />
            <Field name="email" label="Email (optional)" type="email" error={state.errors?.email} />
            <Field name="city" label="City" error={state.errors?.city} />
            <div className="sm:col-span-2">
              <Field name="address" label="Property address" error={state.errors?.address} />
            </div>
          </div>

          {state.status === "error" && state.message && (
            <p className="mt-3 text-sm text-red-600">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            onClick={() => track("cta_click", { action: "submit-lead", source: "insurance-wizard" })}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Request my free inspection
          </button>

          <p className="mt-4 text-xs text-slate-500">
            Southeast Roofing documents damage and gives honest guidance — we do not
            determine coverage or act as your insurance adjuster. Your insurer decides
            your claim.
          </p>
        </form>
      </div>
    );
  }

  // Question view
  const totalApplicable = applicable.length;
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-navy-900 transition-all"
            style={{ width: `${((stepIndex + 1) / totalApplicable) * 100}%` }}
          />
        </div>
        <span className="ml-4 text-sm font-medium text-slate-500">
          {stepIndex + 1} / {totalApplicable}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-navy-900">{step.question}</h2>
      <div className="mt-6 flex flex-col gap-3">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => choose(step.key, opt.value)}
            className="flex items-center justify-between rounded-xl border border-border bg-white px-5 py-4 text-left font-semibold text-navy-900 transition hover:border-navy-900 hover:bg-secondary"
          >
            <span>{opt.label}</span>
            {opt.hint && <span className="text-sm font-normal text-slate-500">{opt.hint}</span>}
          </button>
        ))}
      </div>

      {stepIndex > 0 && (
        <button
          type="button"
          onClick={() => setStepIndex(stepIndex - 1)}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy-900"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
      )}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <input
        name={name}
        type={type}
        className="rounded-xl border border-border bg-white px-4 py-2.5 outline-none focus:border-steel-500"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
