import { ExternalLink, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * The two Mississippi licences, with a way to check each one.
 *
 * ONE COMPONENT SO THE TWO NUMBERS CANNOT DRIFT APART. They come from two
 * different MSBOC registers, they look nothing like each other, and the
 * commercial one arrived two months after the residential one was already
 * written into a dozen places by hand. Every surface that shows licensure
 * renders this, so there is no page where a building owner sees the
 * residential number alone and concludes we are a house company.
 *
 * The verification links are the point. Anybody can print a number on a
 * website; a link to the state's own register is the thing a cautious
 * property manager actually wants, and it is the strongest trust signal on
 * the site because it is not ours to fake.
 */

interface License {
  label: string;
  number: string;
  href: string;
  /** What this licence permits, in the words a customer would use. */
  covers: string;
}

export function licenses(): License[] {
  const list: License[] = [];
  if (siteConfig.license) {
    list.push({
      label: "MSBOC Residential License",
      number: siteConfig.license,
      href: siteConfig.links.msbocLicense,
      covers:
        "Houses, townhomes and other residential property across Mississippi.",
    });
  }
  if (siteConfig.licenseCommercial) {
    list.push({
      label: "MSBOC Commercial Certificate of Responsibility",
      number: siteConfig.licenseCommercial,
      href: siteConfig.links.msbocCommercialLicense,
      covers:
        "Commercial buildings: offices, retail, warehouses, churches, apartments and light industrial.",
    });
  }
  return list;
}

export function LicensePanel({
  heading = "Licensed in Mississippi for residential and commercial roofing",
  className = "",
}: {
  heading?: string;
  className?: string;
}) {
  const list = licenses();
  if (!list.length) return null;

  return (
    <section
      aria-labelledby="license-panel-heading"
      className={`shadow-premium rounded-2xl border border-border bg-white p-6 sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck
          className="mt-0.5 size-6 shrink-0 text-steel-500"
          aria-hidden="true"
        />
        <div>
          <h2
            id="license-panel-heading"
            className="font-display text-xl font-bold text-navy-900"
          >
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {siteConfig.legalName} is licensed by the Mississippi State Board of
            Contractors on both sides of the trade. Each number below links to
            the board&rsquo;s own record, so you can check it without taking our
            word for anything.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.map((license) => (
          <li
            key={license.number}
            className="rounded-xl border border-border bg-secondary p-5"
          >
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              {license.label}
            </p>
            <p className="mt-1.5 font-display text-2xl font-extrabold text-navy-900">
              {license.number}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {license.covers}
            </p>
            {/*
              Descriptive anchor text, never "click here". A screen reader
              user tabbing the links on this page hears which licence each one
              verifies, and a crawler reads the same thing.
            */}
            <a
              href={license.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
            >
              Verify {siteConfig.name}&rsquo;s {license.label} {license.number}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The commercial licence on its own, for commercial pages.
 *
 * A property manager reading the TPO page does not need the residential
 * number in front of them, they need to know we are allowed to be on their
 * building at all. The full panel still exists for /licenses and About, where
 * the whole picture is the point.
 */
export function CommercialLicenseCallout({
  className = "",
}: {
  className?: string;
}) {
  if (!siteConfig.licenseCommercial) return null;

  return (
    <div
      className={`rounded-2xl border border-border bg-secondary p-6 sm:p-7 ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck
          className="mt-0.5 size-6 shrink-0 text-steel-500"
          aria-hidden="true"
        />
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">
            Licensed for commercial roofing in Mississippi
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {siteConfig.legalName} holds Mississippi State Board of Contractors
            Commercial Certificate of Responsibility{" "}
            <strong className="text-navy-900">
              {siteConfig.licenseCommercial}
            </strong>
            , alongside residential license {siteConfig.license}. Commercial
            work in Mississippi requires that certificate, and plenty of the
            crews that show up after a storm do not hold one.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={siteConfig.links.msbocCommercialLicense}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 underline underline-offset-4 transition-colors hover:text-navy-900"
            >
              Verify MSBOC Commercial License {siteConfig.licenseCommercial}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
