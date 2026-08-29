import Image from "next/image";
import Link from "next/link";

import {
  CallLink,
  EmailLink,
  TextLink,
} from "@/components/shared/contact-actions";
import { SocialLinks } from "@/components/shared/social-links";
import { footerNav } from "@/config/navigation";
import { SERVICE_AREAS } from "@/config/service-areas";
import { siteConfig } from "@/config/site";

/**
 * Footer.
 *
 * Two rules shaped this. First, the logo uses its trimmed artwork so the
 * intrinsic aspect ratio is real (1.69:1, not the 1:1 of the padded source)
 * and it can never appear stretched. Second, it is a footer, not a link
 * warehouse: four restrained columns on desktop, collapsed on mobile so
 * nobody scrolls through four screens of raw lists.
 *
 * ONE tree, not two. This used to render a collapsed <details> copy for
 * phones and an expanded copy for desktop, which put every link in the
 * document twice: duplicated crawl content, two headings per column, and a
 * second set of links for a screen reader to walk past.
 *
 * The accordion is gone rather than made responsive. CSS cannot open a closed
 * <details> (the content is hidden on the shadow slot, so overriding display
 * on the child does nothing), and the alternatives all cost more than the
 * problem: a checkbox toggle is not a disclosure to a screen reader, and a
 * client component would ship JavaScript to every page for an animation.
 * Twenty-eight links in a two-column grid is about 500px of phone scroll,
 * which is a footer, and every link stays reachable at every width.
 */

const COLUMNS = [
  { title: "Services", links: footerNav.services.slice(0, 7) },
  { title: "Commercial", links: footerNav.commercial.slice(0, 7) },
  { title: "Company", links: footerNav.company },
  {
    title: "Service Areas",
    links: [
      ...SERVICE_AREAS.slice(0, 6).map((a) => ({
        label: `${a.city}, MS`,
        href: `/service-areas/${a.slug}`,
      })),
      { label: "All areas", href: "/service-areas" },
    ],
  },
] as const;

export function SiteFooter() {
  const { parent, address } = siteConfig;

  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="container-site py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Identity and direct contact */}
          <div className="lg:col-span-4">
            <Image
              src="/brand/southeast-lights-mark.png"
              alt="Southeast Lights"
              width={1751}
              height={1034}
              className="h-14 w-auto object-contain"
            />
            <p className="mt-6 max-w-xs leading-relaxed text-bone-500">
              Holiday, permanent and architectural lighting for homes,
              communities and commercial property across South Mississippi.
            </p>

            <div className="mt-7 flex flex-col gap-3 text-bone-300">
              <CallLink className="w-fit transition-colors hover:text-champagne-300" />
              <TextLink className="w-fit transition-colors hover:text-champagne-300" />
              <EmailLink className="w-fit transition-colors hover:text-champagne-300" />
            </div>

            {address.streetAddress ? (
              <address className="mt-5 text-sm leading-relaxed text-bone-500 not-italic">
                {address.streetAddress}
                <br />
                {address.addressLocality}, {address.addressRegion}{" "}
                {address.postalCode}
              </address>
            ) : null}

            <SocialLinks className="mt-6 -ml-2 flex items-center gap-1" />
          </div>

          {/* Link columns. One tree; see the note above. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:col-span-8 lg:grid-cols-4 lg:gap-x-8">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-sm font-semibold text-bone-100">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5 lg:mt-5 lg:gap-3">
                  {column.links.map((link) => (
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
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/*
        The roofing relationship. Visible and credible, deliberately secondary:
        lighting customers become roofing customers, not the other way round.
      */}
      <div className="border-t border-white/[0.07]">
        <div className="container-site flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-7">
          <Image
            src="/brand/southeast-roofing-mark.png"
            alt=""
            width={479}
            height={278}
            className="h-9 w-auto shrink-0 object-contain opacity-60 invert"
          />
          <p className="max-w-xl text-sm leading-relaxed text-bone-500">
            Southeast Lights is the lighting division of{" "}
            <span className="text-bone-300">{parent.name}</span>, a licensed
            Mississippi roofing contractor.{" "}
            <a
              href={parent.url}
              className="text-champagne-400 underline-offset-4 hover:underline"
            >
              Need a roof?
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-bone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName} d/b/a{" "}
            {siteConfig.name}.
            {parent.license ? ` MS Contractor #${parent.license}.` : ""}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-champagne-300"
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
