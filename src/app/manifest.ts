import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Web app manifest (PRD §10.5). Makes the site installable and — crucially —
 * supplies the icons Android/Chrome use for the "Add to Home Screen" / installed
 * PWA tile. iOS pulls its home-screen icon from `apple-icon.png` instead.
 *
 * Icons are the real Southeast Roofing emblem composited onto a white tile
 * (public/icons/*, generated from public/images/brand/southeast-roofing-mark.png).
 */

/** Brand navy (globals.css --primary) for the browser/status-bar chrome. */
const THEME_COLOR = "#123b63";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: THEME_COLOR,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
