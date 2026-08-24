import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    /**
     * The previous site was on Wix and used a different URL scheme. Every
     * one of these paths has live SEO equity, so they are permanently
     * redirected at launch rather than left to 404. Do not remove these:
     * they are the whole reason the DNS cutover keeps its rankings.
     */
    return [
      { source: "/residential-lights", destination: "/holiday-lighting/residential", permanent: true },
      { source: "/commercial-lights", destination: "/holiday-lighting/commercial", permanent: true },
      { source: "/christmas-additions", destination: "/holiday-lighting/additions", permanent: true },
      { source: "/services", destination: "/holiday-lighting", permanent: true },
      { source: "/areas", destination: "/service-areas", permanent: true },
      { source: "/gallery", destination: "/projects", permanent: true },
      { source: "/accessibility-statement", destination: "/accessibility", permanent: true },
    ];
  },
};

export default nextConfig;
