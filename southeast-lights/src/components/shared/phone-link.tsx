import { Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The office number, rendered from siteConfig so it can never drift from the
 * NAP that Google has verified. Renders nothing if the number is unset
 * rather than showing a broken tel: link.
 */
export function PhoneLink({
  className,
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  if (!siteConfig.phone.tel) return null;

  return (
    <a
      href={`tel:${siteConfig.phone.tel}`}
      className={cn("inline-flex items-center gap-2 font-medium", className)}
    >
      {showIcon ? <Phone className="size-4" strokeWidth={1.5} /> : null}
      {siteConfig.phone.display}
    </a>
  );
}
