import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { siteConfig } from "@/config/site";

import "./globals.css";

/**
 * Root layout: fonts + global metadata only. The marketing shell
 * (header/footer/CTAs) lives in the (marketing) route group so the Sanity
 * Studio at /studio can render full-screen (PRD §9.2).
 */

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Roofing Contractor in Hattiesburg, MS`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  /**
   * Browser favicons use a TRANSPARENT roof mark that follows the tab theme:
   * navy on light tabs, white on dark tabs. The theme-aware SVG handles this in
   * all modern browsers (Chrome/Edge 80+, Firefox, Safari 16.4+) via
   * prefers-color-scheme; the light/dark PNGs are a fallback for browsers that
   * take a favicon `media` hint but not SVG; app/favicon.ico (auto-wired) is the
   * universal legacy fallback. Installed-app icons (apple-icon.png + the
   * manifest's public/icons/*) keep the filled navy tile — the standard there.
   */
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-32.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      { url: "/favicon/favicon-white-32.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon/favicon-16.png", type: "image/png", sizes: "16x16", media: "(prefers-color-scheme: light)" },
      { url: "/favicon/favicon-white-16.png", type: "image/png", sizes: "16x16", media: "(prefers-color-scheme: dark)" },
    ],
    // Installed-app icon (filled navy tile) — the manual `icon` list above
    // suppresses file-convention auto-detection, so declare it explicitly.
    apple: "/apple-icon.png",
  },
  // Search-engine ownership verification — set a token in env to emit its tag.
  // Google Search Console + Bing Webmaster Tools (Bing also offers a one-click
  // "import from Google Search Console" that needs no tag).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? {
                other: {
                  "msvalidate.01":
                    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
                },
              }
            : {}),
        },
      }
    : {}),
};

// Tints the mobile browser UI and the installed-app status bar with the brand
// navy (matches the manifest theme_color).
export const viewport: Viewport = {
  themeColor: "#123b63",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
