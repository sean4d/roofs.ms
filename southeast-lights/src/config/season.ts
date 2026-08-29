/**
 * Seasonal engine.
 *
 * Southeast Lights has two personalities and the site switches between them
 * on the calendar. Everything that decides WHEN lives in this file, so the
 * dates can be moved without touching a single component.
 *
 *   holiday   Aug 1 - Dec 31. Christmas is the product. Upscale, cinematic,
 *             dark, festive. Sub-messaging escalates Aug -> Dec.
 *   offSeason Jan 1 - Jul 31. Premium exterior and architectural lighting
 *             leads. Permanent lighting becomes the hero service. Mardi Gras
 *             surfaces Jan-Feb.
 *
 * IMPORTANT SEO RULE: this changes visual hierarchy and homepage emphasis
 * ONLY. Holiday pages stay permanently crawlable year-round. Never gate a
 * route, a link or content on the season, and never vary output by
 * user-agent. That would be cloaking.
 */

export type SeasonMode = "holiday" | "offSeason";

/** Business timezone. All seasonal decisions are made in local time. */
export const BUSINESS_TIMEZONE = "America/Chicago";

/**
 * Holiday mode runs from this month/day through the end of the year.
 * Change these two numbers to move the whole seasonal switch.
 */
export const HOLIDAY_WINDOW = {
  startMonth: 8, // August
  startDay: 1,
  endMonth: 12, // through December 31
  endDay: 31,
} as const;

/**
 * The install season. Owner-supplied 2026-08-29: crews install from 1 October
 * and the last install date is 15 December.
 *
 * This is NOT the same as HOLIDAY_WINDOW above, and conflating the two is the
 * mistake to avoid. That window decides how the site LOOKS, and runs to the
 * end of December so the site stays festive through Christmas. These dates
 * decide what the site PROMISES, and they stop on the 15th, because after
 * that there is no crew day left to give anybody.
 */
export const INSTALL_SEASON = {
  startMonth: 10,
  startDay: 1,
  endMonth: 12,
  endDay: 15,
  /** For copy. Kept beside the numbers so the two cannot drift apart. */
  startLabel: "October 1",
  endLabel: "December 15",
} as const;

/**
 * Phases inside holiday mode. Each drives its own honest urgency message.
 * No fake countdowns: the scarcity is real because the calendar is real.
 *
 * `closed` exists because 16 to 31 December is still holiday mode on the
 * site while the install season is over. Saying "availability is limited" in
 * that fortnight would be selling something that cannot be delivered.
 */
export type HolidayPhase = "booking" | "underway" | "limited" | "closed";

export interface SeasonMessaging {
  /** Short badge above the hero headline. */
  badge: string;
  /** One-line urgency note near the primary CTA. */
  urgency: string;
}

const HOLIDAY_MESSAGING: Record<HolidayPhase, SeasonMessaging> = {
  // August - September, before crews go out
  booking: {
    badge: "Now Booking Holiday Installations",
    urgency: `Installations begin ${INSTALL_SEASON.startLabel}. Early bookings choose their install week.`,
  },
  // October 1 - November 30, crews are out
  underway: {
    badge: "Holiday Installations Underway",
    urgency: `Crews are installing now. The last install date is ${INSTALL_SEASON.endLabel}.`,
  },
  // December 1 - 15, the last fortnight of install days
  limited: {
    badge: "Limited Holiday Availability",
    urgency: `Installs finish ${INSTALL_SEASON.endLabel}. Larger commercial displays may need to be scheduled for next season.`,
  },
  // December 16 - 31, the season is over but the site is still festive
  closed: {
    badge: "Booking for Next Season",
    urgency: `This season's installs finished ${INSTALL_SEASON.endLabel}. Book now to choose your install week for next year.`,
  },
};

const OFF_SEASON_MESSAGING: SeasonMessaging = {
  badge: "Premium Exterior & Architectural Lighting",
  urgency:
    "Permanent lighting installs year-round. Holiday displays for this year are open for early booking.",
};

/** Month and day in the business timezone, independent of server locale. */
export function businessDateParts(now: Date): { month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return { month: get("month"), day: get("day") };
}

/** Calendar-driven default mode. */
export function seasonModeForDate(now: Date): SeasonMode {
  const { month, day } = businessDateParts(now);
  const afterStart =
    month > HOLIDAY_WINDOW.startMonth ||
    (month === HOLIDAY_WINDOW.startMonth && day >= HOLIDAY_WINDOW.startDay);
  const beforeEnd =
    month < HOLIDAY_WINDOW.endMonth ||
    (month === HOLIDAY_WINDOW.endMonth && day <= HOLIDAY_WINDOW.endDay);
  return afterStart && beforeEnd ? "holiday" : "offSeason";
}

/** Which holiday sub-phase we are in. Only meaningful in holiday mode. */
export function holidayPhaseForDate(now: Date): HolidayPhase {
  const { month, day } = businessDateParts(now);
  if (month === INSTALL_SEASON.endMonth) {
    return day > INSTALL_SEASON.endDay ? "closed" : "limited";
  }
  if (month > INSTALL_SEASON.endMonth) return "closed";
  if (month >= INSTALL_SEASON.startMonth) return "underway";
  return "booking";
}

/** Is a crew going out today? Drives copy that promises an install. */
export function isInstallSeason(now: Date): boolean {
  const { month, day } = businessDateParts(now);
  const afterStart =
    month > INSTALL_SEASON.startMonth ||
    (month === INSTALL_SEASON.startMonth && day >= INSTALL_SEASON.startDay);
  const beforeEnd =
    month < INSTALL_SEASON.endMonth ||
    (month === INSTALL_SEASON.endMonth && day <= INSTALL_SEASON.endDay);
  return afterStart && beforeEnd;
}

/** Mardi Gras merchandising window (Jan-Feb), used on Gulf Coast surfaces. */
export function isMardiGrasSeason(now: Date): boolean {
  const { month } = businessDateParts(now);
  return month === 1 || month === 2;
}

/** January keeps secondary holiday messaging: takedown and next-year planning. */
export function isTakedownSeason(now: Date): boolean {
  return businessDateParts(now).month === 1;
}

export function messagingFor(mode: SeasonMode, now: Date): SeasonMessaging {
  return mode === "holiday"
    ? HOLIDAY_MESSAGING[holidayPhaseForDate(now)]
    : OFF_SEASON_MESSAGING;
}

/**
 * Is the `?season=` preview parameter honoured here?
 *
 * Yes on local development AND on Vercel preview deployments, so the site can
 * be reviewed in either personality before launch. No on the production
 * deployment, where the calendar is the only authority.
 *
 * Gated on VERCEL_ENV rather than NODE_ENV because a preview deployment is a
 * production BUILD; NODE_ENV alone would have made the preview unusable,
 * which is the whole reason this parameter exists.
 */
export function seasonPreviewAllowed(): boolean {
  if (process.env.NEXT_PUBLIC_DISABLE_SEASON_PREVIEW === "1") return false;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";
  }
  return process.env.NODE_ENV !== "production";
}

/**
 * Resolve the mode to render in.
 *
 * `override` comes from the `?season=` query parameter. There is deliberately
 * no visible toggle in the UI: this is a URL you have to know.
 */
export function resolveSeasonMode(
  override: string | string[] | undefined,
  now: Date,
  { allowOverride = seasonPreviewAllowed() } = {},
): SeasonMode {
  if (allowOverride) {
    const value = Array.isArray(override) ? override[0] : override;
    if (value === "holiday") return "holiday";
    if (value === "offseason" || value === "offSeason") return "offSeason";
  }
  return seasonModeForDate(now);
}
