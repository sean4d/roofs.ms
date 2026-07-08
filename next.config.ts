import type { NextConfig } from "next";

import { siteConfig } from "./src/config/site";

/** Legacy Wix city URLs (/{city}-services) → new service-area pages. Driven by
 *  the service-area list so every community Google has indexed is covered. */
const legacyCityRedirects = siteConfig.serviceArea.map((c) => ({
  source: `/${c.slug}-services`,
  destination: `/service-areas/${c.slug}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 defaults images.qualities to [75] only and coerces any other
    // quality prop to the nearest allowed value. Whitelist 65 so the hero
    // image's lower quality (under its heavy navy overlay) actually applies.
    qualities: [65, 70, 75],
  },
  // The TikTok slideshow builder shells out to a static ffmpeg binary in
  // @ffmpeg-installer/<platform>. The wrapper does dynamic requires the bundler
  // can't statically resolve, so keep it external (required at runtime), and
  // explicitly ship the binary + platform package into the upload route bundle.
  serverExternalPackages: ["@ffmpeg-installer/ffmpeg"],
  outputFileTracingIncludes: {
    "/api/upload": ["./node_modules/@ffmpeg-installer/**/*"],
  },
  // Permanent (301/308) redirects from legacy Wix URLs Google still has
  // indexed to the closest equivalent page — preserves SEO equity and keeps
  // old search-result clicks off the 404 page. Add more here as Search
  // Console surfaces additional legacy paths under "Not indexed / 404".
  async redirects() {
    return [
      {
        source: "/insurance-solutions",
        destination: "/storm-damage/insurance-claims",
        permanent: true,
      },
      ...legacyCityRedirects,
      {
        source: "/emergency-roofing",
        destination: "/storm-damage/emergency-roofing",
        permanent: true,
      },
      {
        source: "/roof-revive",
        destination: "/residential/roof-repair",
        permanent: true,
      },
      {
        source: "/roof-washing",
        destination: "/residential/roof-repair",
        permanent: true,
      },
      {
        source: "/roof-cleaning",
        destination: "/residential/roof-repair",
        permanent: true,
      },
      {
        source: "/roof-repair",
        destination: "/residential/roof-repair",
        permanent: true,
      },
      {
        source: "/roof-replacement",
        destination: "/residential/roof-replacement",
        permanent: true,
      },
      {
        source: "/residential-roofing",
        destination: "/residential",
        permanent: true,
      },
      {
        source: "/commercial-roofing",
        destination: "/commercial",
        permanent: true,
      },
      {
        // Typo slug from the old site, confirmed indexed as-is.
        source: "/commerical-roofing",
        destination: "/commercial",
        permanent: true,
      },
      {
        source: "/gutters",
        destination: "/residential/gutters",
        permanent: true,
      },
      {
        source: "/gutter-installation",
        destination: "/residential/gutters",
        permanent: true,
      },
      {
        source: "/gutter-cleaning",
        destination: "/residential/gutters",
        permanent: true,
      },
      { source: "/areas", destination: "/service-areas", permanent: true },
      { source: "/services", destination: "/residential", permanent: true },
      { source: "/christmas-lights", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
