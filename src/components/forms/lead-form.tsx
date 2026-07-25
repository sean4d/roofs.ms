"use client";

import { useActionState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";

import { submitLead, type LeadFormState } from "@/lib/actions/lead";
import { siteConfig } from "@/config/site";
import { PhoneLink } from "@/components/shared/phone-link";
import { Button } from "@/components/ui/button";

/**
 * Lead capture form (PRD §8 forms). Two variants:
 * - "short": the 30-second free-inspection form (name, phone, email,
 *   city, service, storm flag)
 * - "full": the contact form (adds address, preferred time, message)
 *
 * Success replaces the form with confirmation + optional booking link
 * (NEXT_PUBLIC_BOOKING_URL — e.g. a free Google Calendar appointment
 * schedule). A `lead_submitted` dataLayer event fires for future GA4/GTM.
 */

const SERVICES = [
  "Roof replacement",
  "Roof repair",
  "Storm damage / insurance",
  "Metal roofing",
  "Gutters",
  "Ventilation",
  "Commercial roofing",
  "Something else",
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

export function LeadForm({
  variant,
  source,
  submitLabel,
  successTitle,
  successBody,
  defaultService,
  defaultStorm,
  showBooking = true,
}: {
  variant: "short" | "full";
  source: string;
  /** Restates what the visitor is asking for (per request type). */
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  /** Prefills the "What do you need?" select. */
  defaultService?: string;
  /** Pre-checks the storm/insurance box (storm request pages). */
  defaultStorm?: boolean;
  /** Offer the "pick a time" booking button on success — only makes sense
   *  for requests that involve us coming out. */
  showBooking?: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const pathname = usePathname();
  const bookingUrl = showBooking
    ? (process.env.NEXT_PUBLIC_BOOKING_URL ?? siteConfig.links.booking)
    : undefined;

  useEffect(() => {
    if (state.status === "success") {
      // GTM/GA4 conversion hook (harmless no-op until analytics lands)
      (
        window as Window & { dataLayer?: Record<string, unknown>[] }
      ).dataLayer?.push({ event: "lead_submitted", lead_source: source });
    }
  }, [state.status, source]);

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-border bg-white p-8 text-center sm:p-10">
        <CheckCircle2
          className="mx-auto size-12 text-success-600"
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-2xl font-bold">
          {successTitle ?? "Got it — we'll call you shortly."}
        </h2>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate-600">
          {successBody ??
            "Your request is in. During business hours you'll usually hear from us the same day."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          {bookingUrl && (
            <Button
              size="xl"
              render={
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <CalendarCheck className="size-5" aria-hidden="true" />
              Pick an inspection time now
            </Button>
          )}
          <p className="text-sm text-slate-600">
            Can&apos;t wait? <PhoneLink className="text-navy-900" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-border bg-white p-6 sm:p-8"
      noValidate
    >
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="variant" value={variant} />
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.errors?.name}>
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
            placeholder="you@example.com"
          />
        </Field>
        <Field
          label="City or ZIP"
          name="city"
          error={state.errors?.city}
          optional={variant === "full"}
        >
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="postal-code"
            required={variant === "short"}
            aria-invalid={state.errors?.city ? true : undefined}
            className={inputClass}
            placeholder="Hattiesburg"
          />
        </Field>

        <Field
          label="Street address"
          name="address"
          error={state.errors?.address}
          optional={variant === "full"}
        >
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            required={variant === "short"}
            aria-invalid={state.errors?.address ? true : undefined}
            className={inputClass}
            placeholder="123 Hardy St"
          />
        </Field>

        <Field label="What do you need?" name="service">
          <select
            id="service"
            name="service"
            defaultValue={defaultService}
            className={inputClass}
          >
            {SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </Field>

        {variant === "full" && (
          <Field label="Preferred time to call" name="preferredTime" optional>
            <input
              id="preferredTime"
              name="preferredTime"
              type="text"
              className={inputClass}
              placeholder="Weekday mornings"
            />
          </Field>
        )}
      </div>

      {variant === "full" && (
        <div className="mt-5">
          <Field label="Tell us about your roof" name="message" optional>
            <textarea
              id="message"
              name="message"
              rows={4}
              className={inputClass}
              placeholder="Age of the roof, what you're seeing, anything helpful…"
            />
          </Field>
        </div>
      )}

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5">
        <input
          type="checkbox"
          name="storm"
          defaultChecked={defaultStorm}
          className="mt-0.5 size-4 accent-navy-900"
        />
        <span className="text-sm leading-relaxed text-slate-600">
          This is storm damage or may involve an insurance claim
        </span>
      </label>

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
            {submitLabel ??
              (variant === "short"
                ? "Request my free inspection"
                : "Send message")}
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
        No spam, no obligation. We&apos;ll only use this to reach you about your
        roof. Prefer to talk?{" "}
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
