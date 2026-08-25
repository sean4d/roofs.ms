import Image from "next/image";
import Link from "next/link";

import { CallLink, EmailLink, TextLink } from "@/components/shared/contact-actions";
import { SocialLinks } from "@/components/shared/social-links";
import { footerNav } from "@/config/navigation";
import { SERVICE_AREAS } from "@/config/service-areas";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { address, parent } = siteConfig;

  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="container-site grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-4">
          <Image
            src="/brand/southeast-lights-logo.png"
            alt="Southeast Lights"
            width={2048}
            height={2048}
            className="h-16 w-auto"
          />
          <p className="max-w-sm text-sm leading-relaxed text-bone-500">
            Professional holiday, permanent and architectural lighting for
            homes, communities and commercial properties across South
            Mississippi and the Gulf Coast.
          </p>

          <div className="flex flex-col gap-2.5 text-sm text-bone-300">
            <CallLink className="transition-colors hover:text-champagne-300" />
            <TextLink className="transition-colors hover:text-champagne-300" />
            <EmailLink className="transition-colors hover:text-champagne-300" />
            {address.streetAddress ? (
              <address className="mt-1 not-italic text-bone-500">
                {address.streetAddress}
                <br />
                {address.addressLocality}, {address.addressRegion}{" "}
                {address.postalCode}
              </address>
            ) : null}
          </div>

          <SocialLinks className="-ml-2 flex items-center gap-1" />
        </div>

        <FooterColumn title="Services" links={footerNav.services} className="lg:col-span-2" />
        <FooterColumn title="Commercial" links={footerNav.commercial} className="lg:col-span-2" />
        <FooterColumn title="Company" links={footerNav.company} className="lg:col-span-2" />

        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-bone-100">Service Areas</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {SERVICE_AREAS.slice(0, 8).map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="text-sm text-bone-500 transition-colors hover:text-champagne-300"
                >
                  {area.city}, MS
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/service-areas"
                className="text-sm font-medium text-champagne-400 transition-colors hover:text-champagne-300"
              >
                All areas
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/*
        The roofing relationship. Present and credible, but deliberately at
        the bottom of the page so it never competes with lighting conversion.
        Lighting customers are future roofing customers, not the reverse.
      */}
      <div className="border-t border-white/[0.07]">
        <div className="container-site flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/southeast-roofing-logo.png"
              alt=""
              width={500}
              height={500}
              className="h-11 w-auto opacity-70 invert"
            />
            <p className="max-w-md text-sm leading-relaxed text-bone-500">
              Southeast Lights is the lighting division of{" "}
              <span className="text-bone-300">{parent.name}</span>, a licensed
              Mississippi roofing contractor.{" "}
              <a
                href={parent.url}
                className="text-champagne-400 underline-offset-4 hover:underline"
              >
                Need roofing?
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-site flex flex-col gap-3 py-6 pb-24 text-xs text-bone-500 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName} d/b/a{" "}
            {siteConfig.name}.
            {parent.license ? ` MS Contractor #${parent.license}.` : ""} All
            rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-champagne-300">
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

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-bone-100">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-bone-500 transition-colors hover:text-champagne-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
