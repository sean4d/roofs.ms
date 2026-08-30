"use server";

import { deliverLead, type Lead } from "@/lib/leads";
import { geocode } from "@/lib/quotes/measure";

/**
 * Turn what the visitor typed into the fields a CRM needs.
 *
 * The forms now ask for city and ZIP in separate boxes, so the common case
 * needs nothing from this function. It used to be one "City or ZIP" box,
 * which is a fair question to ask a homeowner and the wrong shape for Roofr:
 * it requires city, state and postal code as three separate required fields,
 * so somebody who typed 39426 gave us a postcode and no city, somebody who
 * typed Hattiesburg gave us a city and no postcode, and either way two of
 * Roofr's three were empty and the job card came back rejected or half blank.
 *
 * What is still missing after two boxes is the STATE, which no form asks for
 * because nobody enjoys being asked what state they live in. So the address
 * is resolved through the same geocoder the estimator uses and the pieces
 * come back separated. Anything the visitor typed themselves wins; the
 * geocoder only fills the gaps.
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

    /*
     * What the visitor typed wins. The geocoder only fills the gaps.
     *
     * This used to be the other way round for three of the four fields, from
     * when the form asked one vague "City or ZIP" question and the geocoder
     * genuinely knew better. It does not any more: someone who typed their
     * own street, city and ZIP is a better authority on their address than a
     * lookup, and `point.formatted` in particular is the WHOLE address, city
     * and state and postcode included, so writing it into `address` put all
     * of that into the CRM's Street field and duplicated the rest.
     *
     * State is the one nothing else supplies, because no form asks for it.
     * That is the gap this call exists to fill.
     */
    return {
      ...lead,
      city: lead.city || point.city,
      state: point.state || undefined,
      postal: lead.postal || point.postal,
      address: lead.address || point.formatted,
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
    firstName: text(formData, "firstName", 60),
    lastName: text(formData, "lastName", 60),
    phone: text(formData, "phone", 30),
    email: text(formData, "email", 200),
    city: text(formData, "city", 100) || undefined,
    postal: text(formData, "postal", 20) || undefined,
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

  /*
   * Name, phone and email are all required on every form.
   *
   * Email was optional until a lead came in without one and Roofr refused to
   * create the job card: "The email must be a valid email address". An
   * optional field that makes the CRM drop the whole lead is not optional,
   * it is a trap. Same reasoning for asking the two name parts separately
   * rather than splitting one box and guessing.
   */
  const errors: Record<string, string> = {};
  if (lead.firstName.length < 1)
    errors.firstName = "Please enter your first name.";
  if (lead.lastName.length < 1)
    errors.lastName = "Please enter your last name.";
  if (!PHONE_RE.test(lead.phone))
    errors.phone = "Please enter a valid phone number.";
  if (!EMAIL_RE.test(lead.email))
    errors.email = "Please enter a valid email address.";

  // The free-inspection ("short") form needs a full property address so the
  // lead can create a proper job (with a roof to measure) in the CRM. The
  // "full" contact form stays low-friction, general questions don't need one.
  if (text(formData, "variant") === "short") {
    if (!lead.address) errors.address = "Please add the property address.";
    if (!lead.city) errors.city = "Please add the city.";
    if (!lead.postal) errors.postal = "Please add the ZIP code.";
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
