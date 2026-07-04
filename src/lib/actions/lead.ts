"use server";

import { deliverLead, type Lead } from "@/lib/leads";

/**
 * Lead form server action (invoked via useActionState). Validates, filters
 * obvious spam via a honeypot field, and fans out through the lead service.
 * No auth needed — this is a public lead-capture endpoint by design; it
 * accepts nothing but contact fields and writes to no data store.
 */

export interface LeadFormState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level errors keyed by input name */
  errors?: Record<string, string>;
}

const PHONE_RE = /^[\d\s()+.-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string, max = 200): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: real users never fill this hidden field. Pretend success so
  // bots don't learn — no lead is delivered.
  if (text(formData, "website")) {
    return { status: "success" };
  }

  const lead: Lead = {
    source: text(formData, "source") || "contact",
    name: text(formData, "name", 100),
    phone: text(formData, "phone", 30),
    email: text(formData, "email", 200) || undefined,
    city: text(formData, "city", 100) || undefined,
    address: text(formData, "address", 200) || undefined,
    service: text(formData, "service", 100) || undefined,
    storm: formData.get("storm") === "on",
    preferredTime: text(formData, "preferredTime", 100) || undefined,
    message: text(formData, "message", 2000) || undefined,
    page: text(formData, "page", 200) || undefined,
    company: text(formData, "company", 150) || undefined,
    role: text(formData, "role", 100) || undefined,
    propertyType: text(formData, "propertyType", 100) || undefined,
    roofType: text(formData, "roofType", 100) || undefined,
    squareFootage: text(formData, "squareFootage", 50) || undefined,
    timeline: text(formData, "timeline", 100) || undefined,
  };

  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = "Please enter your name.";
  if (!PHONE_RE.test(lead.phone))
    errors.phone = "Please enter a valid phone number.";
  if (lead.email && !EMAIL_RE.test(lead.email))
    errors.email = "That email doesn't look right.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  const result = await deliverLead(lead);

  if (!result.delivered) {
    return {
      status: "error",
      message:
        "Something went wrong sending your request. Please call us instead — we answer.",
    };
  }

  return { status: "success" };
}
