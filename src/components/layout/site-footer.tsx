import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { footerColumns, legalLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { brandAssets } from "@/content/brand-assets";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * 5-column footer (PRD §3 section 17): brand blurb + four link columns,
 * then a legal bar. NAP renders from siteConfig only; the license line
 * appears only once a real license number is supplied (integrity rule).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { address } = siteConfig;

  return (
    <footer className="border-t border-charcoal-700 bg-charcoal-900">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src={brandAssets.logo.light}
            alt="Southeast Roofing"
            width={brandAssets.logo.aspect.width}
            height={brandAssets.logo.aspect.height}
            className="h-16 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver-600">
            {siteConfig.tagline}.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-silver-400">
            <PhoneLink />
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {address.addressLocality}, {address.addressRegion}
            </span>
          </div>
        </div>

        {/* Link columns */}
        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-sm font-semibold tracking-wide text-white">
              {column.heading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver-600 transition-colors hover:text-silver-200"
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
      <div className="border-t border-charcoal-700">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-silver-600 sm:flex-row">
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
                  className="transition-colors hover:text-silver-200"
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
