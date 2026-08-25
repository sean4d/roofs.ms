/**
 * Seasonal engine tests.
 *
 *   node --experimental-strip-types scripts/test-season.mjs
 *
 * The window is 1 Aug through 31 Dec on America/Chicago, with three message
 * phases inside it.
 */
import {
  seasonModeForDate,
  holidayPhaseForDate,
  resolveSeasonMode,
  isMardiGrasSeason,
} from "../src/config/season.ts";

const d = (s) => new Date(`${s}T12:00:00Z`);
const checks = [
  ["31 Jul is off-season", seasonModeForDate(d("2026-07-31")), "offSeason"],
  ["1 Aug flips to holiday", seasonModeForDate(d("2026-08-01")), "holiday"],
  ["15 Sep is holiday", seasonModeForDate(d("2026-09-15")), "holiday"],
  ["25 Dec is holiday", seasonModeForDate(d("2026-12-25")), "holiday"],
  ["1 Jan is off-season", seasonModeForDate(d("2027-01-01")), "offSeason"],
  ["May is off-season", seasonModeForDate(d("2027-05-05")), "offSeason"],
  ["Aug phase is booking", holidayPhaseForDate(d("2026-08-15")), "booking"],
  ["Oct phase is underway", holidayPhaseForDate(d("2026-10-05")), "underway"],
  ["Dec phase is limited", holidayPhaseForDate(d("2026-12-05")), "limited"],
  ["Jan is Mardi Gras season", isMardiGrasSeason(d("2027-01-20")), true],
  ["Jun is not Mardi Gras", isMardiGrasSeason(d("2027-06-20")), false],
  ["override works when allowed", resolveSeasonMode("offseason", d("2026-12-01"), { allowOverride: true }), "offSeason"],
  ["override ignored in production", resolveSeasonMode("offseason", d("2026-12-01"), { allowOverride: false }), "holiday"],
];

let failed = 0;
for (const [name, got, want] of checks) {
  const ok = String(got) === String(want);
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "FAIL  "}${name}${ok ? "" : `  got=${got} want=${want}`}`);
}
console.log(failed ? `\n${failed} FAILED` : `\nall ${checks.length} pass`);
process.exit(failed ? 1 : 0);
