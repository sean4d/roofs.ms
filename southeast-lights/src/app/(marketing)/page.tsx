import { Divisions } from "@/components/home/divisions";
import { Hero } from "@/components/home/hero";
import { RentalPitch } from "@/components/home/rental-pitch";
import { TrustBar } from "@/components/home/trust-bar";
import { resolveSeasonMode } from "@/config/season";

/**
 * The homepage is season-aware, so it must not be frozen into a static build
 * at deploy time — otherwise a site built in July would still be in
 * off-season mode in December. Revalidating hourly keeps it cheap while
 * guaranteeing the mode flips within an hour of the calendar.
 */
export const revalidate = 3600;

export default function HomePage() {
  /**
   * [NEEDS: CMS override] — once Sanity is wired, the owner's manual choice
   * is read here and passed as the first argument, so a photo shoot or an
   * early campaign can force either mode without waiting for the calendar.
   */
  const mode = resolveSeasonMode(null, new Date());

  return (
    <>
      <Hero mode={mode} />
      <TrustBar />
      <Divisions mode={mode} />
      <RentalPitch />
    </>
  );
}
