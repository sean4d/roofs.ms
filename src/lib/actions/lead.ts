"use server";

import { deliverLead, type Lead } from "@/lib/leads";
import { geocode } from "@/lib/quotes/measure";

/**
 * Turn what the visitor typed into the fields a CRM needs.
 *
 * The form asks for "City or ZIP" in one box, which is the right question to
 * ask a homeowner and the wrong shape for Roofr, which requires city, state
 * and postal code as three separate required fields. Somebody who types 39426
 * gives us a postcode and no city; somebody who types Hattiesburg gives us a
 * city and no postcode. Either way two of Roofr's three fields are empty and
 * the job card is rejected or lands half blank.
 *
 * So the address is resolved through the same geocoder the estimator uses, and
 * the pieces come back separated. The visitor still answers one easy question.
 *
 * NEVER FATAL. This is a network call sitting in the path of a lead, and a
 * lead is worth far more than a tidy postcode. Any failure, timeout, missing
 * key or unrecognisable address leaves the lead exactly as the visitor typed
 * it and delivery carries on.
 */
async function withAddressParts(lead: Lead): Promise<Lead> {
  const typed = [lead.address, lead.city].filter(Boolean).join(", ");
  if (!typed) return lead;

  try {
    const point = await geocode(typed);
    if (!point) return lead;

    // A bare city name is ambiguous across states: "Columbia" is a real place
    // in Mississippi and a bigger one in South Carolina. Accepting a result
    // from outside the territory would put a Hattiesburg homeowner's job card
    // in the wrong state, which is worse than leaving the field blank. The
    // Gulf Coast work crosses into Alabama and Louisiana, so those count.
    if (point.state && !["MS", "AL", "LA"].includes(point.state)) return lead;

    return {
      ...lead,
      // What the visitor typed wins where the geocoder found nothing, so a
      // resolvable address never loses detail it already had.
      city: point.city || lead.city,
      state: point.state || undefined,
      postal: point.postal || undefined,
      address: point.formatted || lead.address,
    };
  } catch {
    return lead;
  }
}

/**
 * Lead form server action (invoked via useActionState). Validates, filters
 * obvious spam via a honeypot field, and fans out through the lead service.
 * No auth needed. This is a public lead-capture endpoint by design; it
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
  // bots don't learn, no lead is delivered.
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
    preference: text(formData, "preference", 120) || undefined,
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

  // The free-inspection ("short") form needs a property address + city so the
  // lead can create a proper job (with a roof to measure) in the CRM. The
  // "full" contact form stays low-friction, general questions don't need one.
  if (text(formData, "variant") === "short") {
    if (!lead.address) errors.address = "Please add the property address.";
    if (!lead.city) errors.city = "Please add the city or ZIP.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  const result = await deliverLead(await withAddressParts(lead));

  if (!result.delivered) {
    return {
      status: "error",
      message:
        "Something went wrong sending your request. Please call us instead. We answer.",
    };
  }

  return { status: "success" };
}
