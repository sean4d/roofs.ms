/**
 * Seasonal mode. The site presents itself differently depending on the time
 * of year, because the business genuinely works differently:
 *
 *   holiday   (~Sept-Dec) the Christmas display is the product. Booking
 *             urgency, capacity, the install cutoff.
 *   offSeason (~Jan-Aug)  Jellyfish permanent lighting leads, because it is
 *             the year-round product and the reason anyone searches in April.
 *             Holiday moves to an early-bird / waitlist band.
 *
 * The date rule is the default. A CMS override always wins, so the owner can
 * force either mode for a photo shoot or an early campaign without waiting
 * for the calendar.
 */

export type SeasonMode = "holiday" | "offSeason";

/** Month (1-12) the holiday mode switches ON. */
export const HOLIDAY_MODE_START_MONTH = 9;
/** Month (1-12) the holiday mode switches OFF, inclusive. */
export const HOLIDAY_MODE_END_MONTH = 12;

/**
 * Date-driven default. Pass an explicit date in tests; callers on the server
 * should pass `new Date()` so the value is computed per request rather than
 * frozen into a static build.
 */
export function seasonModeForDate(date: Date): SeasonMode {
  const month = date.getMonth() + 1;
  return month >= HOLIDAY_MODE_START_MONTH && month <= HOLIDAY_MODE_END_MONTH
    ? "holiday"
    : "offSeason";
}

/**
 * Resolve the mode the site should render in.
 *
 * @param override "holiday" | "offSeason" from the CMS, or null/undefined to
 *                 fall back to the calendar.
 */
export function resolveSeasonMode(
  override: SeasonMode | null | undefined,
  now: Date,
): SeasonMode {
  return override ?? seasonModeForDate(now);
}

/**
 * Days until a cutoff date, floored at zero. Drives the booking countdown.
 * Returns null when no cutoff is configured, so the UI can hide rather than
 * invent a deadline.
 */
export function daysUntil(cutoff: Date | null, now: Date): number | null {
  if (!cutoff) return null;
  const ms = cutoff.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
