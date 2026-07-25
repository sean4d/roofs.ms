import type { ElementType } from "react";
import {
  CalendarCheck,
  ClipboardCheck,
  CloudLightning,
  FileCheck,
  Mail,
  ShieldCheck,
  Timer,
  Wrench,
} from "lucide-react";

/**
 * Lead REQUEST TYPES — one per kind of thing a visitor can actually ask for.
 *
 * Before this, every CTA on the site funnelled to /free-inspection, so clicking
 * "Get your itemized proposal" landed you on an inspection page — a promise the
 * page didn't keep. Each request type below gets its own page, headline, form
 * labels, and confirmation copy, so the page always matches the button.
 *
 * All of them submit through the SAME pipeline (LeadForm → submitLead →
 * deliverLead), so every request still reaches the lead email service and the
 * CRM/Roofr webhook. The `source` value is what tells them apart in the inbox
 * and on the job card — keep those strings stable.
 */

export interface LeadRequestPoint {
  icon: ElementType;
  title: string;
  text: string;
}

export interface LeadRequest {
  key: string;
  /** Route for this request type. */
  path: string;
  /** Distinguishes the lead in the notification email + CRM webhook. */
  source: string;
  metaTitle: string;
  metaDescription: string;
  /** Breadcrumb + nav label. */
  label: string;
  h1: string;
  intro: string;
  /** Submit button text — should restate exactly what they're asking for. */
  submitLabel: string;
  /** Confirmation headline + body after a successful submit. */
  successTitle: string;
  successBody: string;
  /** Prefills the form's "What do you need?" select. */
  defaultService?: string;
  /** Pre-checks the storm/insurance box. */
  defaultStorm?: boolean;
  /** Show the "pick a time" booking button on success (visit-based requests). */
  showBooking?: boolean;
  /** Optional radio choice shown on the form (e.g. emailed ballpark vs on-site
   *  measure). The selected label rides along to the office + CRM. */
  choice?: {
    legend: string;
    name: "preference";
    options: { value: string; label: string; hint: string }[];
  };
  /** The three reassurance points beside the form. */
  points: LeadRequestPoint[];
}

export const LEAD_REQUESTS = {
  "free-inspection": {
    key: "free-inspection",
    path: "/free-inspection",
    source: "free-inspection",
    label: "Free Inspection",
    metaTitle: "Free Roof Inspection in Hattiesburg, MS | Southeast Roofing",
    metaDescription:
      "Schedule a free, no-obligation roof inspection anywhere in South Mississippi. Photo documentation, straight answers, and an itemized digital proposal.",
    h1: "Your free roof inspection",
    intro:
      "Thirty seconds to fill out. No cost, no obligation, and a straight answer about your roof — including when the honest answer is that it's fine.",
    submitLabel: "Request my free inspection",
    successTitle: "Got it — we'll call you shortly.",
    successBody:
      "Your inspection request is in. During business hours you'll usually hear from us the same day to find a time that works.",
    showBooking: true,
    points: [
      {
        icon: CalendarCheck,
        title: "We call you back fast",
        text: "Usually the same business day, to find a time that works.",
      },
      {
        icon: ClipboardCheck,
        title: "A real inspection",
        text: "The whole system — shingles, flashing, decking, ventilation — documented with photos.",
      },
      {
        icon: FileCheck,
        title: "An itemized proposal",
        text: "Straight to your email, priced line by line, upgrades you can toggle. No hidden fees, no pressure.",
      },
    ],
  },

  estimate: {
    key: "estimate",
    path: "/estimate",
    source: "estimate-request",
    label: "Free Estimate",
    metaTitle: "Free Roofing Estimate in Hattiesburg, MS | Southeast Roofing",
    metaDescription:
      "Request a free, itemized roofing estimate in South Mississippi — every line priced, emailed to you, with no pressure and nothing pre-checked.",
    h1: "Get your free itemized estimate",
    intro:
      "Tell us about the roof and we'll put together a real written estimate — every line priced, emailed to you. No pressure, nothing pre-checked, no obligation to book anything.",
    submitLabel: "Send me my itemized estimate",
    successTitle: "Got it — your estimate is being put together.",
    successBody:
      "A real person is reviewing your request. We'll reach out to confirm a couple of details, then email your itemized estimate.",
    // Not everyone wants someone on their roof yet — let them say so up front.
    choice: {
      legend: "How would you like your estimate?",
      name: "preference",
      options: [
        {
          value: "Emailed ballpark — no visit yet",
          label: "Email me a ballpark first",
          hint: "A range based on your details and aerial measurements. Nobody comes out until you say so.",
        },
        {
          value: "On-site measure for an exact price",
          label: "Come measure for an exact price",
          hint: "We inspect the roof, check the decking and flashing, and price it line by line.",
        },
      ],
    },
    points: [
      {
        icon: FileCheck,
        title: "Priced line by line",
        text: "Shingle, underlayment, ice & water shield, starter, ridge cap, disposal — each on its own line, so you see exactly what you're buying.",
      },
      {
        icon: Mail,
        title: "Emailed to you",
        text: "Yours to keep, compare, and think about. Upgrades are optional and clearly priced — nothing comes pre-checked.",
      },
      {
        icon: ShieldCheck,
        title: "From a licensed local crew",
        text: "GAF Certified, MS License #R22245, BBB A-rated — and still here long after the storm-chasers leave.",
      },
    ],
  },

  "storm-inspection": {
    key: "storm-inspection",
    path: "/storm-inspection",
    source: "storm-inspection",
    label: "Storm Inspection",
    metaTitle: "Storm Damage Roof Inspection in Mississippi | Southeast Roofing",
    metaDescription:
      "Request a documented storm damage roof inspection in South Mississippi. Photo evidence for your claim, adjuster meetings, and honest answers — free, no obligation.",
    h1: "Request a storm damage inspection",
    intro:
      "Hail, wind, or a named storm? We document the damage the way a claim file needs it — thorough photos, every slope walked — and we'll tell you honestly whether it's worth filing.",
    submitLabel: "Request my storm inspection",
    successTitle: "Got it — we'll get to you quickly.",
    successBody:
      "Storm requests get priority. We'll call to schedule, and if water is coming in now, call us directly — our emergency line is open 24/7.",
    defaultService: "Storm damage / insurance",
    defaultStorm: true,
    showBooking: true,
    points: [
      {
        icon: CloudLightning,
        title: "Documented for your claim",
        text: "Wide shots, close-ups of hail bruising and wind-lifted tabs, interior water intrusion — evidence your insurer can act on.",
      },
      {
        icon: ClipboardCheck,
        title: "We meet your adjuster",
        text: "On the roof, speaking the same test-square language, making sure nothing gets missed in the scope.",
      },
      {
        icon: ShieldCheck,
        title: "Honest either way",
        text: "If the damage is less than your deductible, we'll say so. We never inflate scope or offer to waive a deductible.",
      },
    ],
  },

  repair: {
    key: "repair",
    path: "/repair",
    source: "repair-request",
    label: "Roof Repair",
    metaTitle: "Request a Roof Repair in Hattiesburg, MS | Southeast Roofing",
    metaDescription:
      "Leak, missing shingles, or damaged flashing? Request a roof repair in South Mississippi — we find the source, price the fix honestly, and tell you if a repair is enough.",
    h1: "Request a roof repair",
    intro:
      "Leak, missing shingles, a bad pipe boot? Tell us what you're seeing. We find the actual source, price the fix, and tell you plainly whether a repair is enough or the roof is past it.",
    submitLabel: "Request my repair",
    successTitle: "Got it — we'll be in touch shortly.",
    successBody:
      "Your repair request is in. We'll call to get the details and schedule a look. If it's an active leak, call us — we prioritize water coming in.",
    defaultService: "Roof repair",
    showBooking: true,
    points: [
      {
        icon: Wrench,
        title: "We find the real source",
        text: "Most leaks start at flashing, valleys, or a dry-rotted pipe boot — not where the stain shows up inside.",
      },
      {
        icon: Timer,
        title: "Repairs, not upsells",
        text: "When a repair is genuinely enough, that's what we recommend — and we'll show you the photos either way.",
      },
      {
        icon: FileCheck,
        title: "Priced before we start",
        text: "You get the number in writing first. No surprise charges once someone's on the roof.",
      },
    ],
  },
} satisfies Record<string, LeadRequest>;

export type LeadRequestKey = keyof typeof LEAD_REQUESTS;

export const leadRequestList: LeadRequest[] = Object.values(LEAD_REQUESTS);

/**
 * Best-matching request type for a service page, picked from its slug/path, so
 * a repair page's CTA asks for a repair and a storm page's asks for a storm
 * inspection — instead of every page offering the same generic inspection.
 * Falls back to the free inspection, which suits replacement/install pages.
 */
export function requestForSlug(slugAndPath: string): LeadRequest {
  const s = slugAndPath.toLowerCase();
  if (/storm|hail|wind|insurance|claim|emergency/.test(s)) {
    return LEAD_REQUESTS["storm-inspection"];
  }
  if (/repair|leak/.test(s)) return LEAD_REQUESTS.repair;
  return LEAD_REQUESTS["free-inspection"];
}

/** CTA label for a request type, used on service heroes. */
export function requestCtaLabel(request: LeadRequest): string {
  switch (request.key) {
    case "repair":
      return "Request a Repair";
    case "storm-inspection":
      return "Request a Storm Inspection";
    case "estimate":
      return "Get My Itemized Estimate";
    default:
      return "Schedule Free Inspection";
  }
}
