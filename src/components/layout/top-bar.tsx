import { Mail, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/shared/social-links";

/**
 * Slim utility bar above the main header (owner request 2026-07-04):
 * social profiles on the right, phone + email on the left (desktop).
 * Scrolls away naturally — the main header below stays sticky.
 */
export function TopBar() {
  return (
    <div className="bg-navy-950 text-white">
      <div className="container-site flex h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-5 text-xs">
          {siteConfig.phone.tel && (
            <a
              href={`tel:${siteConfig.phone.tel}`}
              className="hidden items-center gap-1.5 font-medium text-steel-100 transition-colors hover:text-white sm:inline-flex"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {siteConfig.phone.display}
            </a>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1.5 font-medium text-steel-100 transition-colors hover:text-white"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              <span className="hidden md:inline">{siteConfig.email}</span>
              <span className="md:hidden">Email us</span>
            </a>
          )}
        </div>
        <SocialLinks />
      </div>
    </div>
  );
}
