import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { PhoneLink } from "@/components/shared/phone-link";
import { Button } from "@/components/ui/button";

/**
 * Commercial final CTA band (PRD §4.2): consultation-first — commercial
 * buyers expect a conversation, not an instant quote.
 */
export function CommercialCta() {
  return (
    <Section tone="navy" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-steel-300) 1px, transparent 1px), linear-gradient(90deg, var(--color-steel-300) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s talk about your roof
          </h2>
          <p className="mt-4 text-lg text-steel-100">
            A consultation, not a sales pitch: we assess your building, your
            operations, and your budget cycle — then propose the system that
            actually fits.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button
            size="xl"
            className="bg-white text-primary hover:bg-steel-100"
            render={<Link href="/commercial/request-consultation" />}
            nativeButton={false}
          >
            Request a Commercial Consultation
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <PhoneLink className="text-base text-white" />
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 text-base font-semibold text-white transition-opacity hover:opacity-75"
            >
              <Mail className="size-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
