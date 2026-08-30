"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { AddressFields } from "@/components/forms/address-fields";
import { FileUpload } from "@/components/forms/file-upload";
import {
  ChipGroup,
  Field,
  Honeypot,
  Select,
  TextArea,
  TextInput,
} from "@/components/forms/field";
import { RESIDENTIAL_BUDGETS } from "@/config/pricing";
import { enabledServices } from "@/config/services";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import {
  clearEstimate,
  estimateSnapshot,
  serverEstimateSnapshot,
  subscribeEstimate,
} from "@/lib/estimate-handoff";

type Errors = Record<string, string>;

export function ResidentialQuoteForm() {
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  /* Whatever the customer built in the estimator before clicking through.
     Via useSyncExternalStore because sessionStorage does not exist on the
     server, so the card must be absent in the server render and appear on
     the client without a hydration mismatch. */
  const estimate = useSyncExternalStore(
    subscribeEstimate,
    estimateSnapshot,
    serverEstimateSnapshot,
  );

  const serviceOptions = enabledServices().map((service) => service.label);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      kind: "residential" as const,
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? ""),
      postal: String(form.get("postal") ?? ""),
      notes: String(form.get("notes") ?? ""),
      services,
      budget: budget || undefined,
      estimate: estimate ?? undefined,
      attribution: captureAttribution(),
      company: honeypot,
    };

    try {
      const response = await postLead(payload, files);
      const data = await response.json();

      if (!response.ok) {
        if (data.issues) {
          setErrors(
            Object.fromEntries(
              data.issues.map((i: { path: string; message: string }) => [
                i.path,
                i.message,
              ]),
            ),
          );
        }
        setMessage(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      if (files.length)
        track("upload_completed", {
          context: "residential",
          count: files.length,
        });
      track("residential_lead_submit", {
        budget: budget || "unspecified",
        estimateTotal: estimate?.total ?? 0,
      });
      clearEstimate();
      setStatus("sent");
    } catch {
      setMessage(
        `We could not submit that. Please call or text ${siteConfig.phone.display}.`,
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card-lit flex flex-col items-start gap-4 p-8">
        <CheckCircle2 className="size-9 text-champagne-400" strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold">Request received.</h2>
        <p className="max-w-md leading-relaxed text-bone-300">
          Thanks. We have your details and we will review the property from the
          address and aerial imagery before we come back to you.
        </p>
        <p className="text-sm text-bone-500">{siteConfig.responseTime}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative flex flex-col gap-6"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />

      {estimate?.total ? (
        <div className="card-lit flex flex-col gap-1 p-5">
          <p className="text-xs tracking-[0.14em] text-champagne-400 uppercase">
            Your estimate is attached
          </p>
          <p className="text-lg font-semibold text-bone-100">
            About ${Math.round(estimate.total).toLocaleString("en-US")}
          </p>
          <p className="text-sm leading-relaxed text-bone-500">
            {[
              estimate.roofFt ? `${estimate.roofFt} ft of roofline` : null,
              estimate.colorScheme,
            ]
              .filter(Boolean)
              .join(" \u00b7 ")}
            {estimate.roofFt || estimate.colorScheme ? ". " : ""}
            Everything you chose comes through with this request, so we quote
            the display you designed.
          </p>
        </div>
      ) : null}

      {/* Two name boxes, not one.
          A single "Your name" field left us splitting on the first space to
          fill the CRM's two required name fields, so anyone who typed one
          word got a last name invented for them. Asking for both parts is
          the only version where nothing is guessed and nothing is blank.

          Phone and email both required for the same reason: the CRM rejects
          the whole job card when the email is missing or malformed, and a
          rejected card is a lead we never see. */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="firstName"
          label="First name"
          required
          error={errors.firstName}
        >
          <TextInput
            id="firstName"
            name="firstName"
            placeholder="John"
            autoComplete="given-name"
            required
            error={errors.firstName}
          />
        </Field>
        <Field id="lastName" label="Last name" required error={errors.lastName}>
          <TextInput
            id="lastName"
            name="lastName"
            placeholder="Smith"
            autoComplete="family-name"
            required
            error={errors.lastName}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="phone" label="Phone" required error={errors.phone}>
          <TextInput
            id="phone"
            name="phone"
            placeholder="(601) 555-0123"
            type="tel"
            autoComplete="tel"
            required
            error={errors.phone}
          />
        </Field>
        <Field id="email" label="Email" required error={errors.email}>
          <TextInput
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            required
            error={errors.email}
          />
        </Field>
      </div>

      <AddressFields
        errors={errors}
        hint="We measure from aerial imagery, so the address is how we price accurately without a site visit."
      />

      <ChipGroup
        legend="What are you interested in?"
        options={serviceOptions}
        selected={services}
        onToggle={(value) =>
          setServices((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value],
          )
        }
      />

      <Field
        id="budget"
        label="Budget range"
        hint="Helps us design something that fits rather than quoting past it."
      >
        <Select
          id="budget"
          name="budget"
          value={budget}
          onChange={(event) => {
            setBudget(event.target.value);
            if (event.target.value) {
              track("budget_selected", { budget: event.target.value });
            }
          }}
        >
          <option value="">Select a range</option>
          {RESIDENTIAL_BUDGETS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </Select>
      </Field>

      <FileUpload
        files={files}
        onChange={setFiles}
        label="Photos of your property"
        hint="A few pictures of the front of the house help us price accurately without coming out. Not required."
        context="residential"
      />

      <Field id="notes" label="Anything else?" error={errors.notes}>
        <TextArea
          id="notes"
          name="notes"
          placeholder="Trees you want wrapped, color preferences, a date you need it finished by..."
        />
      </Field>

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-lg border border-brand-400/40 bg-brand-500/10 px-4 py-3 text-sm text-brand-300"
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary self-start disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Request my quote"}
        <ArrowRight className="size-4" strokeWidth={2} />
      </button>

      <p className="text-xs text-bone-500">{siteConfig.responseTime}</p>
    </form>
  );
}

/** Submit as multipart when files are attached, JSON otherwise. */
async function postLead(payload: unknown, files: File[]) {
  if (files.length === 0) {
    return fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
  const form = new FormData();
  form.append("lead", JSON.stringify(payload));
  for (const file of files) form.append("files", file);
  return fetch("/api/leads", { method: "POST", body: form });
}
