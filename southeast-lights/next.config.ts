import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /*
     * 320 is here for the art-directed hero. next/image builds `fill` srcSets
     * from deviceSizes alone, and the default list starts at 640, so the hero
     * that is hidden at the current breakpoint still pulls a 640px file even
     * though its `sizes` resolves to 1px. Adding a smaller rung lets the
     * browser pick that instead. The rest of the list is the Next default.
     */
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async headers() {
    // Hard noindex on every pre-launch deployment. Removed automatically the
    // moment NEXT_PUBLIC_VERCEL_ENV is "production" on the real domain.
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },

  async redirects() {
    /**
     * The previous site was on Wix and used a different URL scheme. Every
     * one of these paths has live SEO equity, so they are permanently
     * redirected at launch rather than left to 404. Do not remove these:
     * they are the whole reason the DNS cutover keeps its rankings.
     */
    return [
      {
        source: "/residential-lights",
        destination: "/services/residential-holiday-lighting",
        permanent: true,
      },
      {
        source: "/commercial-lights",
        destination: "/services/commercial-holiday-lighting",
        permanent: true,
      },
      {
        source: "/christmas-additions",
        destination: "/services/tree-wrapping",
        permanent: true,
      },
      { source: "/areas", destination: "/service-areas", permanent: true },
      { source: "/gallery", destination: "/projects", permanent: true },
      {
        source: "/accessibility-statement",
        destination: "/accessibility",
        permanent: true,
      },

      /*
       * The rest of the Wix inventory, taken from its own sitemaps rather than
       * from memory: pages, blog-posts, blog-categories and booking-services.
       * Without these, every one of them 404s the day the domain moves.
       *
       * Both posts target "christmas light installation hattiesburg ms", the
       * money keyword, so they land on that service page rather than the
       * homepage. The :slug catch-alls cover anything unpublished or added to
       * Wix after this inventory was taken.
       */
      {
        source: "/blog",
        destination: "/services/christmas-light-installation",
        permanent: true,
      },
      {
        source:
          "/post/transform-your-holidays-with-professional-christmas-light-installation-in-hattiesburg-ms",
        destination: "/services/christmas-light-installation",
        permanent: true,
      },
      {
        source:
          "/post/professional-christmas-light-installation-in-hattiesburg-ms-surrounding-areas",
        destination: "/services/christmas-light-installation",
        permanent: true,
      },
      {
        source: "/post/:slug",
        destination: "/services/christmas-light-installation",
        permanent: true,
      },
      {
        source: "/book-online",
        destination: "/quote",
        permanent: true,
      },
      {
        source: "/service-page/:slug",
        destination: "/quote",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
