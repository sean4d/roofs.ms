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
  // Google Search Console verification — set the token in env to emit the tag.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
