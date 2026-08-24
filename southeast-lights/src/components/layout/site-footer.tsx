import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { PhoneLink } from "@/components/shared/phone-link";
import { SocialLinks } from "@/components/shared/social-links";
import { commercialNav, divisionsNav, visibleNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const legalNav = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

export function SiteFooter() {
  const { address, parent } = siteConfig;
  const divisions = visibleNav(divisionsNav);

  return (
    <footer className="surface-night border-t border-night-700">
      <div className="container-site grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <p className="font-display text-lg font-bold text-white">
            Southeast<span className="text-glow-500">&nbsp;Lights</span>
          </p>
          <p className="max-w-xs text-sm text-steel-300">
            Year-round lighting for South Mississippi. Holiday displays on a
            full-service rental plan, and permanent architectural lighting.
          </p>

          {/*
            The parent-company line is a trust signal, not boilerplate.
            Southeast Lights is a d/b/a of Southeast Roofing LLC — one legal
            entity — which is why the licence and insurance genuinely carry
            over. Never write "subsidiary" here.
          */}
          <p className="text-sm text-steel-300">
            A division of{" "}
            <a
              href={parent.url}
              className="text-glow-400 underline-offset-4 hover:underline"
            >
              {parent.name}
            </a>
            {parent.license ? (
              <>
                {" "}
                &middot; Licensed &amp; insured under MS #{parent.license}
              </>
            ) : null}
          </p>

          <SocialLinks className="mt-1 -ml-2 flex items-center gap-1" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">What we do</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {divisions.map((division) => (
              <li key={division.href}>
                <Link
                  href={division.href}
                  className="text-sm text-steel-300 transition-colors hover:text-glow-400"
                >
                  {division.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/estimator"
                className="text-sm text-steel-300 transition-colors hover:text-glow-400"
              >
                Pricing Estimator
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Commercial</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {commercialNav.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-steel-300 transition-colors hover:text-glow-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Get in touch</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-steel-300">
            <li>
              <PhoneLink className="transition-colors hover:text-glow-400" />
            </li>
            {siteConfig.email ? (
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-glow-400"
                >
                  <Mail className="size-4" strokeWidth={1.5} />
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
            {address.streetAddress ? (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                <span>
                  {address.streetAddress}
                  <br />
                  {address.addressLocality}, {address.addressRegion}{" "}
                  {address.postalCode}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-night-800">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-steel-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName} d/b/a{" "}
            {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-glow-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
