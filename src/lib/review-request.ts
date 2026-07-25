import "server-only";

import { siteConfig } from "@/config/site";

/**
 * Post-job review requests. When a job is uploaded with a customer's email
 * and/or phone, we (a) auto-email them a thank-you + one-tap Google review
 * link via Resend, and (b) hand the owner ready-to-send sms:/mailto: links so
 * they can also text/email the customer from their own phone with one tap.
 *
 * Everything is optional and best-effort: no customer contact → nothing sent;
 * no RESEND_API_KEY → the email is skipped but the tap-to-send links still work.
 */

const REVIEW_LINK = siteConfig.links.googleReview;

/** The friendly message body (shared by email + SMS). */
export function reviewRequestMessage(name?: string): string {
  const hi = name?.trim() ? `Hi ${name.trim().split(/\s+/)[0]}, ` : "Hi, ";
  return (
    `${hi}thanks for trusting ${siteConfig.name} with your roof! If you were ` +
    `happy with how it went, a quick Google review would mean the world to us ` +
    `and helps your neighbors find a roofer they can trust: ${REVIEW_LINK}`
  );
}

/** Prefilled sms: and mailto: links for one-tap sending by the owner. */
export function reviewRequestLinks(opts: { name?: string; email?: string; phone?: string }) {
  const body = reviewRequestMessage(opts.name);
  const phone = (opts.phone ?? "").replace(/[^\d+]/g, "");
  return {
    smsHref: phone ? `sms:${phone}?&body=${encodeURIComponent(body)}` : undefined,
    mailtoHref: opts.email
      ? `mailto:${opts.email}?subject=${encodeURIComponent(
          `Thanks from ${siteConfig.name}`,
        )}&body=${encodeURIComponent(body)}`
      : undefined,
  };
}

/** Auto-send the review request by email (Resend). Returns true if sent. */
export async function sendReviewRequestEmail(opts: {
  name?: string;
  email: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !opts.email) return false;
  const hostname = new URL(siteConfig.url).hostname;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${siteConfig.name} <reviews@${hostname}>`,
        to: [opts.email],
        reply_to: siteConfig.email,
        subject: `Thanks from ${siteConfig.name} — mind leaving a review?`,
        text: reviewRequestMessage(opts.name),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
