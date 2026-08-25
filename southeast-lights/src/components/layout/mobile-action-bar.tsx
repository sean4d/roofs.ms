"use client";

import Link from "next/link";
import { MessageSquare, Phone, Sparkles } from "lucide-react";

import { primaryCta } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";

/**
 * Sticky mobile action bar: Quote | Text | Call.
 *
 * Quote is deliberately dominant. It occupies the largest cell, carries the
 * brand fill and reads first, because a quote request is a qualified lead
 * while a phone call is an interruption that might not be one.
 *
 * Sits above the iOS home indicator via safe-area padding, and every page
 * reserves space for it so it never covers footer content.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-950/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-2 px-3 py-2.5">
        <Link
          href={primaryCta.href}
          onClick={() => track("quote_cta_click", { location: "mobile_bar" })}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-3.5 text-sm font-semibold text-white active:bg-brand-600"
        >
          <Sparkles className="size-4" strokeWidth={2} />
          Get a Quote
        </Link>

        {siteConfig.phone.sms ? (
          <a
            href={`sms:${siteConfig.phone.sms}`}
            onClick={() => track("text_click", { location: "mobile_bar" })}
            className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-white/15 py-2 text-bone-200 active:bg-white/5"
          >
            <MessageSquare className="size-4" strokeWidth={1.5} />
            <span className="text-[0.7rem] font-medium">Text</span>
          </a>
        ) : null}

        {siteConfig.phone.tel ? (
          <a
            href={`tel:${siteConfig.phone.tel}`}
            onClick={() => track("call_click", { location: "mobile_bar" })}
            className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-white/15 py-2 text-bone-200 active:bg-white/5"
          >
            <Phone className="size-4" strokeWidth={1.5} />
            <span className="text-[0.7rem] font-medium">Call</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
