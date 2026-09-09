import Link from "next/link";

import { finalCta } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { PhoneLink } from "@/components/shared/phone-link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

/**
 * Final CTA (PRD §3.13): last conversion push before the footer, with a
 * quieter secondary path for commercial visitors.
 */
export function FinalCta() {
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
            {finalCta.title}
          </h2>
          <p className="mt-4 text-lg text-steel-100">{finalCta.description}</p>
        </Reveal>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button
            size="xl"
            className="bg-white text-primary hover:bg-steel-100"
            render={<Link href={finalCta.primary.href} />}
            nativeButton={false}
          >
            {finalCta.primary.label}
          </Button>
          {/*
            OUR OWN ESTIMATOR, SO IT IS A Link.

            This comment used to read "External Roofr instant estimator, opens
            in a new tab" and both halves had stopped being true. The estimator
            was brought in house months ago and the href is /instant-estimate,
            but the markup was never revisited: the highest-intent button on the
            homepage was still a plain anchor throwing our own page into a second
            tab. Client-side navigation now, same tab, back button works.
          */}
          <Button
            size="xl"
            variant="outline"
            className="border-white/35 bg-white/5 text-white hover:border-white hover:bg-white/15"
            render={<Link href={finalCta.estimate.href} />}
            nativeButton={false}
          >
            {finalCta.estimate.label}
          </Button>
          {/* GoodLeap financing application, an outside site, same tab. */}
          <Button
            size="xl"
            variant="outline"
            className="border-white/35 bg-white/5 text-white hover:border-white hover:bg-white/15"
            render={<a href={finalCta.financing.href} />}
            nativeButton={false}
          >
            {finalCta.financing.label}
          </Button>
        </div>
        <div className="mt-6 flex justify-center">
          <PhoneLink className="text-base text-white" />
        </div>

        <div className="mt-8">
          <Link
            href={finalCta.commercial.href}
            className="text-sm text-steel-300 underline-offset-4 hover:text-white hover:underline"
          >
            {finalCta.commercial.label}
          </Link>
        </div>
      </div>
    </Section>
  );
}
