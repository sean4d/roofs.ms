import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Web app manifest: the icons and name Android and Chrome use when someone
 * adds the site to a home screen. iOS ignores this and reads apple-icon.png.
 *
 * Icons come from scripts/build-icons.mjs, rendered at each size from the
 * roof mark rather than downscaled in the browser from one large file.
 */

/** The site's own near-black, so the app chrome matches the page. */
const THEME_COLOR = "#0A0908";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name}: ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: THEME_COLOR,
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
