import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

/**
 * Inter for interface and body: neutral, and it disappears, which is what a
 * body face should do.
 *
 * Fraunces for display. A high-contrast old-style face with optical sizing,
 * chosen deliberately over the geometric sans every contractor site uses:
 * it reads as considered and expensive rather than as a template, and its
 * warmth suits lighting photography far better than a cold grotesque. Only
 * the softer, lower-wonk optical settings are used so it never turns
 * decorative.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  // Variable axes require the full weight range, so no fixed weight list here.
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/southeast-lights-logo.png",
    apple: "/brand/southeast-lights-logo.png",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

/** Dark by default: the browser chrome should match the page, not fight it. */
export const viewport: Viewport = {
  themeColor: "#0A0908",
  colorScheme: "dark",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}

        {/*
          Google Analytics loads only when an ID is configured, so previews
          and local development never pollute production data. Pixels for
          Meta, TikTok or Google Ads can be added the same way later; every
          conversion event already flows through lib/analytics.ts.
        */}
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
