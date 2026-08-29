"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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

  const serviceOptions = enabledServices().map((service) => service.label);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      kind: "residential" as const,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      notes: String(form.get("notes") ?? ""),
      services,
      budget: budget || undefined,
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
      track("residential_lead_submit", { budget: budget || "unspecified" });
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" required error={errors.name}>
          <TextInput
            id="name"
            name="name"
            autoComplete="name"
            required
            error={errors.name}
          />
        </Field>
        <Field id="phone" label="Phone" required error={errors.phone}>
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            error={errors.phone}
          />
        </Field>
      </div>

      <Field id="email" label="Email" required error={errors.email}>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
      </Field>

      <Field
        id="address"
        label="Property address"
        required
        error={errors.address}
        hint="We measure from aerial imagery, so the address is how we price accurately without a site visit."
      >
        {/* The placeholder shows the shape the CRM can be filled from: with
            the city comma-separated, the lead email can split city, state and
            ZIP onto their own lines instead of leaving them for a human. */}
        <TextInput
          id="address"
          name="address"
          autoComplete="street-address"
          placeholder="123 Main St, Hattiesburg, MS 39401"
          required
          error={errors.address}
        />
      </Field>

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
