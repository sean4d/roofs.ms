"use client";

import { useActionState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { submitLead, type LeadFormState } from "@/lib/actions/lead";
import { siteConfig } from "@/config/site";
import { PhoneLink } from "@/components/shared/phone-link";
import { Button } from "@/components/ui/button";

/**
 * Commercial consultation form (PRD §4.2): company, contact name/role,
 * property type, address, roof type, square footage, timeline,
 * description. Delivered through the same lead pipeline with
 * source="commercial-consultation" so the owner can triage. No
 * instant-quote framing — commercial buyers expect a consultation.
 */

const PROPERTY_TYPES = [
  "Office / retail",
  "School / educational",
  "Church / worship",
  "Apartments / multifamily",
  "Industrial / manufacturing",
  "Warehouse / distribution",
  "Municipal / government",
  "Agricultural",
  "Other",
];

const ROOF_TYPES = [
  "Not sure",
  "TPO / single-ply membrane",
  "EPDM (rubber)",
  "Modified bitumen / built-up",
  "Metal",
  "Shingle",
  "Coated / restored",
];

const TIMELINES = [
  "As soon as possible",
  "Within 3 months",
  "3–12 months",
  "Budgeting / planning stage",
];

const initialState: LeadFormState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-slate-400 transition-colors focus:border-steel-500 focus:ring-3 focus:ring-steel-500/20 focus:outline-none aria-invalid:border-destructive";

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-navy-900"
      >
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-slate-400">optional</span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function CommercialForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const pathname = usePathname();

  useEffect(() => {
    if (state.status === "success") {
      (
        window as Window & { dataLayer?: Record<string, unknown>[] }
      ).dataLayer?.push({
        event: "lead_submitted",
        lead_source: "commercial-consultation",
      });
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-border bg-white p-8 text-center sm:p-10">
        <CheckCircle2
          className="mx-auto size-12 text-success-600"
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-2xl font-bold">
          Request received.
        </h2>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate-600">
          We&apos;ll reach out to schedule your consultation — during business
          hours, usually the same day.
        </p>
        <p className="mt-6 text-sm text-slate-600">
          Need us sooner? <PhoneLink className="text-navy-900" />
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-border bg-white p-6 sm:p-8"
      noValidate
    >
      <input type="hidden" name="source" value="commercial-consultation" />
      <input type="hidden" name="page" value={pathname} />
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Contact name" name="name" error={state.errors?.name}>
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
        </Field>
        <Field label="Phone" name="phone" error={state.errors?.phone}>
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
        </Field>
        <Field label="Email" name="email" error={state.errors?.email} optional>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={state.errors?.email ? true : undefined}
            className={inputClass}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Company / organization" name="company" optional>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass}
            placeholder="Organization name"
          />
        </Field>
        <Field label="Your role" name="role" optional>
          <input
            id="role"
            name="role"
            type="text"
            autoComplete="organization-title"
            className={inputClass}
            placeholder="Facility manager, owner…"
          />
        </Field>
        <Field label="Property type" name="propertyType">
          <select id="propertyType" name="propertyType" className={inputClass}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Property address" name="address" optional>
          <input
            id="address"
            name="address"
            type="text"
            className={inputClass}
            placeholder="Street, city"
          />
        </Field>
        <Field label="Current roof type" name="roofType" optional>
          <select id="roofType" name="roofType" className={inputClass}>
            {ROOF_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Approx. square footage" name="squareFootage" optional>
          <input
            id="squareFootage"
            name="squareFootage"
            type="text"
            inputMode="numeric"
            className={inputClass}
            placeholder="e.g. 20,000"
          />
        </Field>
        <Field label="Timeline" name="timeline" optional>
          <select id="timeline" name="timeline" className={inputClass}>
            {TIMELINES.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Tell us about the project" name="message" optional>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={inputClass}
            placeholder="Leaks, age of the roof, upcoming budget cycle — anything helpful."
          />
        </Field>
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="xl"
        disabled={pending}
        className="mt-6 w-full"
      >
        {pending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Request consultation
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
        No obligation. Prefer to talk?{" "}
        {siteConfig.phone.tel ? (
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-medium text-slate-600 hover:text-navy-900"
          >
            Call {siteConfig.phone.display}
          </a>
        ) : (
          <span>Call {siteConfig.phone.display}</span>
        )}
        .
      </p>
    </form>
  );
}
