import { Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface PhoneLinkProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * Renders the company phone number. Until the real number is supplied
 * (siteConfig.phone.tel is null. A [NEEDS] item), this renders the visible
 * placeholder as plain text instead of a fake tel: link.
 */
export function PhoneLink({ className, showIcon = true }: PhoneLinkProps) {
  const { display, tel } = siteConfig.phone;

  const content = (
    <>
      {showIcon && <Phone className="size-4" aria-hidden="true" />}
      <span>{display}</span>
    </>
  );

  if (tel) {
    return (
      <a
        href={`tel:${tel}`}
        className={cn(
          "inline-flex items-center gap-2 font-semibold transition-opacity hover:opacity-75",
          className,
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
      title="Phone number coming soon"
    >
      {content}
    </span>
  );
}
