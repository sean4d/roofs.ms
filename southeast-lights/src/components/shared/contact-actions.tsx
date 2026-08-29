"use client";

import { Mail, MessageSquare, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Call, text and email links. Every one fires its analytics event, so the
 * relative value of the three contact modes is measurable rather than assumed.
 *
 * The lighting line accepts SMS, which is why Text is a first-class action
 * rather than buried on the contact page.
 */

export function CallLink({
  className,
  showIcon = true,
  label,
}: {
  className?: string;
  showIcon?: boolean;
  label?: string;
}) {
  if (!siteConfig.phone.tel) return null;
  return (
    <a
      href={`tel:${siteConfig.phone.tel}`}
      onClick={() => track("call_click")}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {showIcon ? <Phone className="size-4" strokeWidth={1.5} /> : null}
      {label ?? siteConfig.phone.display}
    </a>
  );
}

export function TextLink({
  className,
  label = "Text Us",
}: {
  className?: string;
  label?: string;
}) {
  if (!siteConfig.phone.sms) return null;
  return (
    <a
      href={`sms:${siteConfig.phone.sms}`}
      onClick={() => track("text_click")}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <MessageSquare className="size-4" strokeWidth={1.5} />
      {label}
    </a>
  );
}

export function EmailLink({ className }: { className?: string }) {
  if (!siteConfig.email) return null;
  return (
    <a
      href={`mailto:${siteConfig.email}`}
      onClick={() => track("email_click")}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Mail className="size-4" strokeWidth={1.5} />
      {siteConfig.email}
    </a>
  );
}
