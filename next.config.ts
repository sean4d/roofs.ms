import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 defaults images.qualities to [75] only and coerces any other
    // quality prop to the nearest allowed value. Whitelist 65 so the hero
    // image's lower quality (under its heavy navy overlay) actually applies.
    qualities: [65, 70, 75],
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
      {
        source: "/hattiesburg-services",
        destination: "/service-areas/hattiesburg",
        permanent: true,
      },
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
      { source: "/services", destination: "/", permanent: true },
      { source: "/christmas-lights", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
