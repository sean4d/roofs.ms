import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { siteConfig } from "@/config/site";

/**
 * Site-wide default Open Graph / social share image (PRD §10.5). Placed at
 * the app root so every route inherits it unless a segment supplies its own
 * opengraph-image. Branded navy card, white wordmark, real credentials and
 * NAP only, no invented claims (integrity rule, PRD §0.2).
 */

export const alt = `${siteConfig.name}: Roofing Contractor in Hattiesburg, MS`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Brand tokens mirrored from globals.css so the card matches the site. */
const NAVY_950 = "#0a2036";
const NAVY_800 = "#123b63";
const STEEL_300 = "#8faecb";
const STEEL_100 = "#e8eff6";

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public/images/brand/southeast-roofing-logo-white.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: `linear-gradient(135deg, ${NAVY_950} 0%, ${NAVY_800} 100%)`,
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} height={84} alt="" />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Premium Roofing, Done Right
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 22,
            color: STEEL_100,
            maxWidth: 940,
            lineHeight: 1.35,
          }}
        >
          Residential &amp; commercial roofing across South Mississippi:
          replacement, repair, metal systems, and storm restoration.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${STEEL_300}`,
          paddingTop: 30,
          fontSize: 27,
        }}
      >
        <div style={{ display: "flex", color: STEEL_100 }}>
          GAF Certified · MSBOC Licensed · BBB Accredited
        </div>
        <div style={{ display: "flex", fontWeight: 700 }}>
          {siteConfig.phone.display}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
