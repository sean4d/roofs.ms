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
 * Phases inside holiday mode. Each drives its own honest urgency message.
 * No fake countdowns: the scarcity is real because the calendar is real.
 */
export type HolidayPhase = "booking" | "underway" | "limited";

export interface SeasonMessaging {
  /** Short badge above the hero headline. */
  badge: string;
  /** One-line urgency note near the primary CTA. */
  urgency: string;
}

const HOLIDAY_MESSAGING: Record<HolidayPhase, SeasonMessaging> = {
  // August - September
  booking: {
    badge: "Now Booking Holiday Installations",
    urgency:
      "Installation calendars fill through the fall. Early bookings choose their install week.",
  },
  // October - November
  underway: {
    badge: "Holiday Installations Underway",
    urgency:
      "Crews are installing now. Remaining install dates are going quickly.",
  },
  // December
  limited: {
    badge: "Limited Holiday Availability",
    urgency:
      "December availability is limited. Larger commercial displays may need to be scheduled for next season.",
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
  const { month } = businessDateParts(now);
  if (month >= 12) return "limited";
  if (month >= 10) return "underway";
  return "booking";
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
