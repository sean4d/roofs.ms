"use client";

import { useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  CloudLightning,
  ExternalLink,
  Home,
  Loader2,
} from "lucide-react";

import { submitLead, type LeadFormState } from "@/lib/actions/lead";
import { siteConfig } from "@/config/site";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PhoneLink } from "@/components/shared/phone-link";
import { Button } from "@/components/ui/button";

/**
 * Interactive quote wizard (PRD §13 Phase 8, first mini-project). Six
 * guided steps that qualify the lead, then contact details submitted
 * through the same server action + delivery pipeline as every other
 * form (source: "quote-wizard"). No pricing is computed or promised —
 * the wizard routes to the right human process; Roofr remains the
 * instant-number tool and is offered on the success screen.
 */

interface StepOption {
  value: string;
  label: string;
  hint?: string;
}

type Answers = {
  propertyType: string;
  service: string;
  roofType: string;
  timeline: string;
  storm: string;
};

const RESIDENTIAL_SERVICES: StepOption[] = [
  { value: "Roof replacement", label: "Roof replacement", hint: "Full new roof system" },
  { value: "Roof repair", label: "Roof repair", hint: "Leak, damage, or wear in one area" },
  { value: "Storm damage / insurance", label: "Storm damage", hint: "Recent storm, possible claim" },
  { value: "Metal roofing", label: "Metal roofing", hint: "New metal roof or conversion" },
  { value: "Gutters / exterior", label: "Gutters & exterior", hint: "Gutters, leaf guard, siding, fascia" },
  { value: "Not sure — inspection", label: "Not sure yet", hint: "Have a pro look and tell me straight" },
];

const COMMERCIAL_SERVICES: StepOption[] = [
  { value: "Commercial roof replacement", label: "Roof replacement", hint: "Full system replacement" },
  { value: "Commercial repair / leak", label: "Repair or leak", hint: "Active leak or damage" },
  { value: "Roof coating / restoration", label: "Coating / restoration", hint: "Extend the roof you have" },
  { value: "Commercial maintenance", label: "Maintenance program", hint: "Ongoing inspections & upkeep" },
  { value: "Not sure — assessment", label: "Not sure yet", hint: "Start with an honest assessment" },
];

const ROOF_TYPES: StepOption[] = [
  { value: "Asphalt shingle", label: "Asphalt shingle" },
  { value: "Metal", label: "Metal" },
  { value: "Flat / membrane", label: "Flat or membrane" },
  { value: "Other", label: "Something else" },
  { value: "Not sure", label: "Not sure" },
];

const TIMELINES: StepOption[] = [
  { value: "Emergency — leaking now", label: "It's leaking now", hint: "Emergency response" },
  { value: "As soon as possible", label: "As soon as possible" },
  { value: "Within 1-3 months", label: "In the next 1–3 months" },
  { value: "Researching", label: "Just researching", hint: "No pressure — that's smart" },
];

const STORM_OPTIONS: StepOption[] = [
  { value: "yes", label: "Yes", hint: "Storm damage / possible claim" },
  { value: "no", label: "No", hint: "Regular wear or upgrade" },
  { value: "unsure", label: "Not sure", hint: "We'll document either way" },
];

const initialState: LeadFormState = { status: "idle" };
const TOTAL_STEPS = 6;

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 transition-colors focus:border-steel-500 focus:ring-3 focus:ring-steel-500/20 focus:outline-none aria-invalid:border-destructive";

function OptionGrid({
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  options: StepOption[];
  selected: string;
  onSelect: (value: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          aria-pressed={selected === option.value}
          className={cn(
            "rounded-2xl border px-5 py-4 text-left transition-all duration-200",
            selected === option.value
              ? "border-navy-900 bg-navy-900 text-white shadow-md"
              : "border-border bg-white text-navy-900 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md",
          )}
        >
          <span className="block font-semibold">{option.label}</span>
          {option.hint && (
            <span
              className={cn(
                "mt-0.5 block text-sm",
                selected === option.value ? "text-steel-100" : "text-slate-500",
              )}
            >
              {option.hint}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    propertyType: "",
    service: "",
    roofType: "",
    timeline: "",
    storm: "",
  });
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const pathname = usePathname();
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  useEffect(() => {
    if (state.status === "success") {
      (
        window as Window & { dataLayer?: Record<string, unknown>[] }
      ).dataLayer?.push({ event: "lead_submitted", lead_source: "quote-wizard" });
    }
  }, [state.status]);

  const pick =
    (key: keyof Answers) =>
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
    };

  if (state.status === "success") {
    return (
      <div className="shadow-premium rounded-3xl border border-border bg-white p-8 text-center sm:p-10">
        <CheckCircle2
          className="mx-auto size-12 text-success-600"
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-2xl font-bold text-navy-900">
          Done — your quote request is in.
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">
          We&apos;ll call to confirm details and schedule your free
          inspection. During business hours you&apos;ll usually hear from us
          the same day.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          {bookingUrl && (
            <Button
              size="xl"
              render={
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer" />
              }
              nativeButton={false}
            >
              <CalendarCheck className="size-5" aria-hidden="true" />
              Pick an inspection time now
            </Button>
          )}
          <a
            href={siteConfig.links.instantEstimate}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            Want a ballpark right now? Try the instant estimate
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
          <p className="text-sm text-slate-600">
            Can&apos;t wait? <PhoneLink className="text-navy-900" />
          </p>
        </div>
      </div>
    );
  }

  const steps: {
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }[] = [
    {
      title: "What kind of property is it?",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: "Residential", label: "My home", icon: Home, hint: "Houses, camps, rentals" },
            { value: "Commercial", label: "A commercial building", icon: Building2, hint: "Offices, retail, churches, industrial" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => pick("propertyType")(option.value)}
              aria-pressed={answers.propertyType === option.value}
              className={cn(
                "rounded-2xl border px-5 py-6 text-left transition-all duration-200",
                answers.propertyType === option.value
                  ? "border-navy-900 bg-navy-900 text-white shadow-md"
                  : "border-border bg-white text-navy-900 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md",
              )}
            >
              <option.icon
                className={cn(
                  "size-7",
                  answers.propertyType === option.value
                    ? "text-white"
                    : "text-steel-500",
                )}
                aria-hidden="true"
              />
              <span className="mt-3 block font-display text-lg font-bold">
                {option.label}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-sm",
                  answers.propertyType === option.value
                    ? "text-steel-100"
                    : "text-slate-500",
                )}
              >
                {option.hint}
              </span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What do you need done?",
      content: (
        <OptionGrid
          options={
            answers.propertyType === "Commercial"
              ? COMMERCIAL_SERVICES
              : RESIDENTIAL_SERVICES
          }
          selected={answers.service}
          onSelect={pick("service")}
        />
      ),
    },
    {
      title: "What's on the roof now?",
      subtitle: "Best guess is fine — we verify everything on site.",
      content: (
        <OptionGrid
          options={ROOF_TYPES}
          selected={answers.roofType}
          onSelect={pick("roofType")}
        />
      ),
    },
    {
      title: "How soon do you need it?",
      content: (
        <OptionGrid
          options={TIMELINES}
          selected={answers.timeline}
          onSelect={pick("timeline")}
        />
      ),
    },
    {
      title: "Is this storm-related?",
      subtitle:
        "If a storm caused the damage, insurance may cover it — we assist through the entire claims process.",
      content: (
        <OptionGrid
          options={STORM_OPTIONS}
          selected={answers.storm}
          onSelect={pick("storm")}
        />
      ),
    },
    {
      title: "Where do we send your quote?",
      subtitle:
        "A real person reviews every request — no automated pricing, no spam.",
      content: (
        <form action={formAction} noValidate>
          <input type="hidden" name="source" value="quote-wizard" />
          <input type="hidden" name="page" value={pathname} />
          <input type="hidden" name="propertyType" value={answers.propertyType} />
          <input type="hidden" name="service" value={answers.service} />
          <input type="hidden" name="roofType" value={answers.roofType} />
          <input type="hidden" name="timeline" value={answers.timeline} />
          {(answers.storm === "yes" || answers.storm === "unsure") && (
            <input type="hidden" name="storm" value="on" />
          )}
          {/* Honeypot — hidden from humans, tempting to bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-navy-900"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={state.errors?.name ? true : undefined}
                className={inputClass}
                placeholder="Your name"
              />
              {state.errors?.name && (
                <p role="alert" className="mt-1.5 text-sm text-destructive">
                  {state.errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-semibold text-navy-900"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                aria-invalid={state.errors?.phone ? true : undefined}
                className={inputClass}
                placeholder="(601) 555-0123"
              />
              {state.errors?.phone && (
                <p role="alert" className="mt-1.5 text-sm text-destructive">
                  {state.errors.phone}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-navy-900"
              >
                Email{" "}
                <span className="font-normal text-slate-400">optional</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={state.errors?.email ? true : undefined}
                className={inputClass}
                placeholder="you@example.com"
              />
              {state.errors?.email && (
                <p role="alert" className="mt-1.5 text-sm text-destructive">
                  {state.errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-sm font-semibold text-navy-900"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className={inputClass}
                placeholder="Hattiesburg"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-semibold text-navy-900"
            >
              Property address{" "}
              <span className="font-normal text-slate-400">optional</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              className={inputClass}
              placeholder="123 Hardy St"
            />
          </div>

          {state.status === "error" && state.message && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {state.message}
            </p>
          )}

          <Button type="submit" size="xl" disabled={pending} className="mt-6 w-full">
            {pending ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Get my quote
                <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
            No spam, no obligation. We&apos;ll only use this to reach you
            about your roof.
          </p>
        </form>
      ),
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="shadow-premium rounded-3xl border border-border bg-secondary p-6 sm:p-8">
      {/* Progress */}
      <p className="text-sm font-semibold text-slate-500">
        Step {step + 1} of {TOTAL_STEPS}
      </p>
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label="Quote progress"
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"
      >
        <motion.div
          className="h-full rounded-full bg-navy-900"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        />
      </div>

      {/* Active leak → call now beats any form */}
      {answers.timeline === "Emergency — leaking now" && (
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm">
          <CloudLightning
            className="size-4 shrink-0 text-steel-500"
            aria-hidden="true"
          />
          <span className="font-medium text-navy-900">
            Leaking right now? Calling is faster:
          </span>
          <PhoneLink className="font-semibold text-navy-900" />
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="mt-8"
        >
          <h2 className="font-display text-2xl font-bold text-navy-900">
            {current.title}
          </h2>
          {current.subtitle && (
            <p className="mt-2 leading-relaxed text-slate-600">
              {current.subtitle}
            </p>
          )}
          <div className="mt-6">{current.content}</div>
        </motion.div>
      </AnimatePresence>

      {/* Back */}
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>
      )}
    </div>
  );
}
