import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { footerColumns, legalLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { brandAssets } from "@/content/brand-assets";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * 5-column footer on a deep navy surface — the one intentionally dark
 * region of the light theme (PRD §6.3). White knockout logo per §6.6.
 * NAP renders from siteConfig only; the license line appears only once a
 * real license number is supplied (integrity rule).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { address } = siteConfig;

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-site grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src={brandAssets.logo.light}
            alt="Southeast Roofing"
            width={brandAssets.logo.aspect.width}
            height={brandAssets.logo.aspect.height}
            className="h-16 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel-300">
            {siteConfig.tagline}.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 text-sm text-steel-100">
            <PhoneLink />
            {siteConfig.email && (
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="size-4" aria-hidden="true" />
                {siteConfig.email}
              </a>
            )}
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {address.streetAddress && (
                  <>
                    {address.streetAddress}
                    <br />
                  </>
                )}
                {address.addressLocality}, {address.addressRegion}{" "}
                {address.postalCode}
              </span>
            </span>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-steel-300">
            GAF Certified Contractor · BBB Accredited · MSBOC Licensed
          </p>
        </div>

        {/* Link columns */}
        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="font-display text-sm font-semibold tracking-wide text-white">
              {column.heading}
            </h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-steel-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-steel-300 sm:flex-row">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
            {siteConfig.license && (
              <span> · MS Contractor License #{siteConfig.license}</span>
            )}
          </p>
          <ul className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
