import { readFileSync } from "node:fs";
import { join } from "node:path";

import QRCode from "qrcode";

/**
 * The logo and the QR code, prepared on the server for print.
 *
 * WHY THE LOGO IS INLINED RATHER THAN AN IMG TAG. public/icon.svg carries a
 * prefers-color-scheme rule that turns the mark white on a dark background.
 * That is right for a browser tab and catastrophic on paper: a printer sees a
 * white mark on white stock and the masthead comes out empty. Inlining it lets
 * us strip that rule and pin the fill to the brand navy, so the printed sheet
 * is the same every time regardless of the viewer's theme.
 *
 * The QR is generated as an SVG path rather than a PNG so it stays sharp at
 * any print size, and it is built server side so nothing has to load over the
 * network while a rep is standing on a driveway printing from a phone.
 */

const NAVY = "#123b63";

let cachedLogo: string | null = null;

/**
 * The brand mark as inline SVG, forced to navy.
 *
 * Read once per process. Returns null rather than throwing if the file moves,
 * because a proposal without a logo is worth far more than no proposal.
 */
export function logoSvg(): string | null {
  if (cachedLogo !== null) return cachedLogo || null;
  try {
    const raw = readFileSync(join(process.cwd(), "public", "icon.svg"), "utf8");
    cachedLogo = raw
      // Drop the theme-aware stylesheet entirely.
      .replace(/<style>[\s\S]*?<\/style>/g, "")
      // The class it referenced no longer resolves, so paint explicitly.
      .replace(/class="m"/g, `fill="${NAVY}" stroke="${NAVY}"`)
      .replace(/<svg /, '<svg width="100%" height="100%" ');
    return cachedLogo;
  } catch {
    cachedLogo = "";
    return null;
  }
}

/** A QR code as an inline SVG string, sized by its container. */
export async function qrSvg(url: string): Promise<string | null> {
  try {
    const svg = await QRCode.toString(url, {
      type: "svg",
      margin: 0,
      // High correction, because these get printed small and posted, and a
      // scuffed code that still scans is the entire point.
      errorCorrectionLevel: "H",
      color: { dark: NAVY, light: "#ffffff" },
    });
    return svg.replace(/<svg /, '<svg width="100%" height="100%" ');
  } catch {
    return null;
  }
}

/** Render a pre-built SVG string. Ours, from disk or from the QR encoder. */
export function InlineSvg({
  svg,
  className,
}: {
  svg: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
