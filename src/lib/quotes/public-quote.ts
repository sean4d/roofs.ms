import "server-only";

import { siteConfig } from "@/config/site";

/**
 * Saving and sending an estimate that came from the website.
 *
 * The public estimator now asks for a name, email and phone BEFORE showing a
 * price, on the owner's instruction. That turns it from a calculator into a
 * lead tool, and it means every measurement we pay Google for is attached to
 * somebody we can actually call.
 *
 * Since SE8 (2026-10-15) the estimate itself is saved in RoofGo, not in the
 * /pin tables (src/lib/roofgo-lead.ts); what stays here is the email check
 * and the homeowner's email.
 */

/**
 * Reject the addresses that exist to avoid being contacted.
 *
 * The owner's requirement is a real customer with a real email. Full
 * verification, where nothing is shown until a link in the inbox is clicked,
 * would prove it, and would also lose most of the people who are genuinely
 * interested: it puts a five minute gap in the middle of a sixty second tool.
 *
 * So this blocks the throwaway providers, which is where fake addresses
 * actually come from, and lets the PDF delivery do the rest. Somebody who
 * typed a plausible but wrong address simply never receives their estimate,
 * and the office sees an email that bounced.
 */
const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "sharklasers.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "mailnesia.com",
  "spamgourmet.com",
  "mintemail.com",
  "tempinbox.com",
  "emailondeck.com",
  "burnermail.io",
  "moakt.com",
]);

export function emailLooksReal(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 1) return false;
  const domain = email
    .slice(at + 1)
    .toLowerCase()
    .trim();
  if (!domain.includes(".")) return false;
  if (DISPOSABLE.has(domain)) return false;
  // Somebody typing "asdf@asdf.com" gets through, and should: the estimate
  // simply never arrives and the office learns that from the bounce.
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}

/**
 * Email the homeowner their estimate.
 *
 * A LINK, NOT AN ATTACHMENT, and the wording says so. Building a real PDF file
 * on the server would mean shipping a headless browser into the function
 * bundle, tens of megabytes and seconds of cold start. The link opens the same
 * three page document with a print button on it, which is what somebody
 * actually wants on a phone, and it stays live if the price is ever revised.
 */
export async function emailEstimate(args: {
  to: string;
  name: string;
  address: string;
  price: number;
  squares: number;
  url: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[instant-estimate] would email ${args.to}: ${args.url}`);
    return false;
  }

  const host = new URL(siteConfig.url).hostname;
  const firstName = args.name.trim().split(/\s+/)[0] || "there";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${siteConfig.name} <estimates@${host}>`,
      to: [args.to],
      reply_to: siteConfig.email,
      subject: `Your roof estimate for ${args.address.split(",")[0]}`,
      text: [
        `${firstName},`,
        ``,
        `Here is your roof estimate.`,
        ``,
        `${args.address}`,
        `${args.squares} roofing squares, measured from aerial imagery`,
        `Estimated investment: $${args.price.toLocaleString()}`,
        ``,
        `The full three page estimate, including financing options and how a`,
        `storm claim works, is here. You can print it or save it as a PDF:`,
        ``,
        args.url,
        ``,
        `This is an estimate from an aerial measurement, not a bid. It assumes`,
        `one existing layer of shingles, decking that does not need replacing,`,
        `and normal access. We confirm all of that on the roof at a free`,
        `inspection, and anything that changes the price gets shown to you in`,
        `writing first.`,
        ``,
        `Questions, or want the inspection booked? Call ${siteConfig.phone.display}.`,
        ``,
        `${siteConfig.legalName}`,
        `MSBOC #${siteConfig.license}`,
        `${siteConfig.address.streetAddress}, ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}`,
      ].join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}
