"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import {
  ChipGroup,
  Field,
  Honeypot,
  Select,
  TextArea,
  TextInput,
} from "@/components/forms/field";
import { COMMERCIAL_BUDGETS } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { VERTICALS } from "@/config/verticals";
import { track } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

/**
 * The commercial flow is deliberately NOT the residential estimator.
 *
 * A property manager or an HOA board is not going to drag sliders on a
 * cartoon house; they need to describe a property, state a budget band and
 * attach a site plan. Different buyer, different instrument.
 */

const PROJECT_CATEGORIES = [
  "Holiday",
  "Permanent",
  "Landscape",
  "HOA",
  "Municipal",
  "Commercial Building",
  "Church",
  "Hospitality",
  "Event",
  "Mardi Gras",
  "Other",
];

export function CommercialProposalForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const isHoa = propertyType === "HOAs & Communities";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      kind: "commercial" as const,
      organization: String(form.get("organization") ?? ""),
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      propertyType,
      communityName: String(form.get("communityName") ?? ""),
      buildingCount: String(form.get("buildingCount") ?? ""),
      desiredCompletion: String(form.get("desiredCompletion") ?? ""),
      electrical: String(form.get("electrical") ?? ""),
      siteAccess: String(form.get("siteAccess") ?? ""),
      notes: String(form.get("notes") ?? ""),
      projectCategories: categories,
      budget: budget || undefined,
      attribution: captureAttribution(),
      company: honeypot,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
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

      track(isHoa ? "hoa_lead_submit" : "commercial_lead_submit", {
        propertyType,
        budget: budget || "unspecified",
      });
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
        <h2 className="text-2xl font-semibold">Proposal request received.</h2>
        <p className="max-w-md leading-relaxed text-bone-300">
          Thanks. We will review the property and come back with a written
          scope, a design concept and a fixed price. If you have site plans or
          photographs, reply to the confirmation email and attach them.
        </p>
        <p className="text-sm text-bone-500">{siteConfig.responseTime}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="organization" label="Organization or property" required error={errors.organization}>
          <TextInput id="organization" name="organization" required error={errors.organization} />
        </Field>
        <Field id="propertyType" label="Property type" required error={errors.propertyType}>
          <Select
            id="propertyType"
            name="propertyType"
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
            required
            error={errors.propertyType}
          >
            <option value="">Select a type</option>
            {VERTICALS.map((vertical) => (
              <option key={vertical.slug} value={vertical.label}>
                {vertical.label}
              </option>
            ))}
            <option value="Other">Other</option>
          </Select>
        </Field>
      </div>

      {isHoa ? (
        <Field id="communityName" label="Community name" error={errors.communityName}>
          <TextInput id="communityName" name="communityName" error={errors.communityName} />
        </Field>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" required error={errors.name}>
          <TextInput id="name" name="name" autoComplete="name" required error={errors.name} />
        </Field>
        <Field id="phone" label="Phone" required error={errors.phone}>
          <TextInput id="phone" name="phone" type="tel" autoComplete="tel" required error={errors.phone} />
        </Field>
      </div>

      <Field id="email" label="Email" required error={errors.email}>
        <TextInput id="email" name="email" type="email" autoComplete="email" required error={errors.email} />
      </Field>

      <Field id="address" label="Property address" required error={errors.address}>
        <TextInput id="address" name="address" required error={errors.address} />
      </Field>

      <ChipGroup
        legend="Project type"
        options={PROJECT_CATEGORIES}
        selected={categories}
        onToggle={(value) =>
          setCategories((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
          )
        }
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="buildingCount" label="Number of buildings or areas">
          <TextInput id="buildingCount" name="buildingCount" placeholder="e.g. 3 buildings + entrance" />
        </Field>
        <Field id="desiredCompletion" label="Needed by">
          <TextInput id="desiredCompletion" name="desiredCompletion" placeholder="e.g. before Thanksgiving" />
        </Field>
      </div>

      <Field
        id="budget"
        label="Estimated budget"
        hint="A range is enough. It tells us what scale of design to put in front of you."
      >
        <Select
          id="budget"
          name="budget"
          value={budget}
          onChange={(event) => {
            setBudget(event.target.value);
            if (event.target.value) track("budget_selected", { budget: event.target.value });
          }}
        >
          <option value="">Select a range</option>
          {COMMERCIAL_BUDGETS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="electrical" label="Power availability" hint="Outlets at the entrance? Anything we should know?">
          <TextInput id="electrical" name="electrical" />
        </Field>
        <Field id="siteAccess" label="Site access" hint="Lift access, gates, working-hours restrictions.">
          <TextInput id="siteAccess" name="siteAccess" />
        </Field>
      </div>

      <Field id="notes" label="Project notes" error={errors.notes}>
        <TextArea
          id="notes"
          name="notes"
          placeholder="What you have in mind, what you did last year, what you want to change..."
        />
      </Field>

      <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-bone-400">
        Have photographs, a site plan or a property map? Submit this form and
        reply to the confirmation email with the files attached. We will build
        the concept around them.
      </p>

      {status === "error" ? (
        <p role="alert" className="rounded-lg border border-brand-400/40 bg-brand-500/10 px-4 py-3 text-sm text-brand-300">
          {message}
        </p>
      ) : null}

      <button type="submit" disabled={status === "sending"} className="btn-primary self-start disabled:opacity-60">
        {status === "sending" ? "Sending..." : "Request proposal"}
        <ArrowRight className="size-4" strokeWidth={2} />
      </button>

      <p className="text-xs text-bone-500">{siteConfig.responseTime}</p>
    </form>
  );
}
