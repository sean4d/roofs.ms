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

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-base text-primary hover:bg-steel-100"
            render={<Link href={finalCta.primary.href} />}
            nativeButton={false}
          >
            {finalCta.primary.label}
          </Button>
          {/* External Roofr instant estimator — opens in a new tab */}
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 text-base text-white hover:border-white hover:bg-white/10"
            render={
              <a
                href={finalCta.estimate.href}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
          >
            {finalCta.estimate.label}
          </Button>
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
