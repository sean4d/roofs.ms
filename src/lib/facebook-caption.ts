/**
 * Facebook-specific caption shaping.
 *
 * Every platform receives the same generated caption from the /upload review
 * screen, which is right for the body copy and wrong for the trailer. The
 * shared assembleCaption() appends a booking URL and up to nine hashtags,
 * because that is what Google Business Profile and Instagram want. Facebook
 * wants neither, so this adapts the caption on the way out to Facebook only.
 *
 * Nothing here touches the caption stored on the project, shown in the review
 * screen, or sent to Instagram, TikTok, or GBP.
 *
 * Why it matters: Meta gives link-bearing Page posts materially less organic
 * reach than native photo posts, and in 2026 it also caps unverified Pages at
 * a small number of external-link posts per month. An auto-appended booking
 * URL on EVERY job post spends that allowance on posts whose goal was never a
 * click. Facebook hashtags, meanwhile, do nothing for distribution and read as
 * automated when there are nine of them.
 */

import { siteConfig } from "@/config/site";

/** Hashtags a human would plausibly type. Facebook is not Instagram. */
const FB_MAX_HASHTAGS = 3;

const isHashtagLine = (line: string) =>
  line.trim().length > 0 && line.trim().split(/\s+/).every((w) => w.startsWith("#"));

/**
 * Strip the AUTO-APPENDED booking link only.
 *
 * Deliberately not a general URL scrub: if the owner writes a link into the
 * caption on purpose, that is an editorial choice and it survives. What gets
 * removed is the line the system adds to every caption without being asked.
 */
function dropAutoBookingLink(line: string): boolean {
  const booking = siteConfig.links.booking;
  return Boolean(booking) && line.includes(booking);
}

/**
 * Adapt a generated caption for a native Facebook photo post.
 *
 * Keeps the body and the phone number, drops the automatic booking URL, and
 * trims the hashtag block to the first few. Returns the caption unchanged if
 * there is nothing to adapt.
 */
export function facebookMessage(caption: string): string {
  const lines = caption.split("\n");
  const kept: string[] = [];

  for (const line of lines) {
    if (dropAutoBookingLink(line)) continue;

    if (isHashtagLine(line)) {
      const tags = line.trim().split(/\s+/).slice(0, FB_MAX_HASHTAGS);
      kept.push(tags.join(" "));
      continue;
    }

    kept.push(line);
  }

  // Removing a line can leave a triple newline where a blank line used to
  // separate two blocks that are now one.
  const out = kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // A caption consisting of nothing BUT the booking link would come back
  // empty and publish a captionless photo, which is worse than publishing the
  // link. Never let the adapter turn a caption into no caption.
  return out || caption.trim();
}
