import "server-only";

import { db, dbConfigured } from "./db";
import { siteConfig } from "@/config/site";

/**
 * The company's own details, editable by the office.
 *
 * Every value on a customer-facing estimate used to come from
 * src/config/site.ts, so changing a phone number meant a code change and a
 * deploy. The office should own facts about the office.
 *
 * THE FALLBACK IS THE WHOLE DESIGN. Every stored field is nullable, and null
 * means "use site.ts". So the proposal renders correctly before anybody has
 * opened the settings screen, clearing a field reverts to the built-in rather
 * than blanking the document, and a database outage degrades to the values
 * that shipped with the code instead of an empty page. There is no state in
 * which a homeowner receives a proposal with a missing phone number.
 */

export interface CompanyProfile {
  legalName: string;
  displayName: string;
  phone: string;
  phoneTel: string;
  email: string;
  website: string;
  street: string;
  city: string;
  state: string;
  postal: string;
  license: string;
  warranty: string;
  financingLine: string;
  /** The badge list under "Who you would be hiring". */
  credentials: string[];
  /** The closing pitch on page one. */
  headline: string;
  closingLine: string;
  accentColor: string;
  logoDataUri: string | null;
  showStorms: boolean;
  showInsurance: boolean;
  showFinancing: boolean;
}

/** What the proposal shows when nothing has been edited. */
export function defaultProfile(): CompanyProfile {
  const t = siteConfig.trustFacts;
  return {
    legalName: siteConfig.legalName,
    displayName: siteConfig.name,
    phone: siteConfig.phone.display,
    phoneTel: siteConfig.phone.tel ?? "",
    email: siteConfig.email ?? "",
    website: new URL(siteConfig.url).hostname,
    street: siteConfig.address.streetAddress ?? "",
    city: siteConfig.address.addressLocality,
    state: siteConfig.address.addressRegion,
    postal: siteConfig.address.postalCode ?? "",
    license: siteConfig.license ?? "",
    warranty: t.warranty,
    financingLine: t.financing,
    credentials: [
      t.licensed,
      t.insured,
      t.bbbRating,
      t.googleRating,
      t.warranty,
      t.experience,
    ],
    headline: "The next step is a free inspection.",
    closingLine:
      "No cost and no obligation. We go up, photograph what is actually there, and turn this estimate into a firm price. If your roof has years left in it, we will tell you that instead.",
    accentColor: "#123b63",
    logoDataUri: null,
    showStorms: true,
    showInsurance: true,
    showFinancing: true,
  };
}

interface Row {
  legal_name: string | null;
  display_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postal: string | null;
  license: string | null;
  warranty: string | null;
  financing_line: string | null;
  credentials: string[] | null;
  headline: string | null;
  closing_line: string | null;
  accent_color: string | null;
  logo_data_uri: string | null;
  show_storms: boolean;
  show_insurance: boolean;
  show_financing: boolean;
}

/** Blank strings count as "not set", so clearing a box reverts to the default. */
const pick = (stored: string | null | undefined, fallback: string) =>
  stored && stored.trim() ? stored.trim() : fallback;

/**
 * Load the profile, merged over the defaults.
 *
 * Never throws. A proposal that renders with slightly stale contact details
 * beats one that 500s in front of a customer, so a database problem falls
 * through to the shipped values.
 */
export async function getProfile(): Promise<CompanyProfile> {
  const base = defaultProfile();
  if (!dbConfigured()) return base;

  try {
    const rows = (await db()`
      SELECT * FROM company_profile WHERE id = 1
    `) as Row[];
    if (!rows.length) return base;
    const r = rows[0];
    return {
      legalName: pick(r.legal_name, base.legalName),
      displayName: pick(r.display_name, base.displayName),
      phone: pick(r.phone, base.phone),
      // Derived rather than stored: one phone number, typed once.
      phoneTel: `+1${pick(r.phone, base.phone).replace(/\D/g, "")}`,
      email: pick(r.email, base.email),
      website: pick(r.website, base.website),
      street: pick(r.street, base.street),
      city: pick(r.city, base.city),
      state: pick(r.state, base.state),
      postal: pick(r.postal, base.postal),
      license: pick(r.license, base.license),
      warranty: pick(r.warranty, base.warranty),
      financingLine: pick(r.financing_line, base.financingLine),
      credentials:
        r.credentials && r.credentials.length
          ? r.credentials.filter((c) => c.trim())
          : base.credentials,
      headline: pick(r.headline, base.headline),
      closingLine: pick(r.closing_line, base.closingLine),
      accentColor: pick(r.accent_color, base.accentColor),
      logoDataUri: r.logo_data_uri ?? null,
      showStorms: r.show_storms,
      showInsurance: r.show_insurance,
      showFinancing: r.show_financing,
    };
  } catch (error) {
    console.error("[profile] falling back to site config", error);
    return base;
  }
}

export interface ProfileUpdate {
  legalName?: string;
  displayName?: string;
  phone?: string;
  email?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
  license?: string;
  warranty?: string;
  financingLine?: string;
  credentials?: string[];
  headline?: string;
  closingLine?: string;
  accentColor?: string;
  logoDataUri?: string | null;
  showStorms?: boolean;
  showInsurance?: boolean;
  showFinancing?: boolean;
}

/** Save the profile. Absent keys are left alone; empty strings clear a field. */
export async function saveProfile(
  update: ProfileUpdate,
  userId: string,
): Promise<void> {
  const current = (await db()`
    SELECT * FROM company_profile WHERE id = 1
  `) as Row[];
  const c = current[0];

  const val = <T>(next: T | undefined, existing: T) =>
    next === undefined ? existing : next;

  await db()`
    INSERT INTO company_profile (
      id, legal_name, display_name, phone, email, website, street, city, state,
      postal, license, warranty, financing_line, credentials, headline,
      closing_line, accent_color, logo_data_uri, show_storms, show_insurance,
      show_financing, updated_at, updated_by
    ) VALUES (
      1,
      ${val(update.legalName, c?.legal_name ?? null)},
      ${val(update.displayName, c?.display_name ?? null)},
      ${val(update.phone, c?.phone ?? null)},
      ${val(update.email, c?.email ?? null)},
      ${val(update.website, c?.website ?? null)},
      ${val(update.street, c?.street ?? null)},
      ${val(update.city, c?.city ?? null)},
      ${val(update.state, c?.state ?? null)},
      ${val(update.postal, c?.postal ?? null)},
      ${val(update.license, c?.license ?? null)},
      ${val(update.warranty, c?.warranty ?? null)},
      ${val(update.financingLine, c?.financing_line ?? null)},
      ${val(update.credentials, c?.credentials ?? null)},
      ${val(update.headline, c?.headline ?? null)},
      ${val(update.closingLine, c?.closing_line ?? null)},
      ${val(update.accentColor, c?.accent_color ?? null)},
      ${val(update.logoDataUri, c?.logo_data_uri ?? null)},
      ${val(update.showStorms, c?.show_storms ?? true)},
      ${val(update.showInsurance, c?.show_insurance ?? true)},
      ${val(update.showFinancing, c?.show_financing ?? true)},
      now(), ${userId}::uuid
    )
    ON CONFLICT (id) DO UPDATE SET
      legal_name = EXCLUDED.legal_name,
      display_name = EXCLUDED.display_name,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      website = EXCLUDED.website,
      street = EXCLUDED.street,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      postal = EXCLUDED.postal,
      license = EXCLUDED.license,
      warranty = EXCLUDED.warranty,
      financing_line = EXCLUDED.financing_line,
      credentials = EXCLUDED.credentials,
      headline = EXCLUDED.headline,
      closing_line = EXCLUDED.closing_line,
      accent_color = EXCLUDED.accent_color,
      logo_data_uri = EXCLUDED.logo_data_uri,
      show_storms = EXCLUDED.show_storms,
      show_insurance = EXCLUDED.show_insurance,
      show_financing = EXCLUDED.show_financing,
      updated_at = now(),
      updated_by = EXCLUDED.updated_by
  `;
}
