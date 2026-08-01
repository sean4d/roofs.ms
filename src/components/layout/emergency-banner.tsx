import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * Toggleable storm-event banner (PRD §3 persistent elements). Off by
 * default; enabled via siteConfig.flags (later mirrored by the Sanity
 * siteFlags singleton). Deep navy per the v3 palette: red is never a
 * UI color (PRD §6.1).
 */
export function EmergencyBanner() {
  const { emergencyBanner, emergencyBannerMessage } = siteConfig.flags;

  if (!emergencyBanner) return null;

  return (
    <div className="bg-navy-950 text-white">
      <Link
        href="/storm-damage/emergency-roofing"
        className="container-site flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        <TriangleAlert
          className="size-4 shrink-0 text-ember-500"
          aria-hidden="true"
        />
        <span>{emergencyBannerMessage}</span>
      </Link>
    </div>
  );
}
