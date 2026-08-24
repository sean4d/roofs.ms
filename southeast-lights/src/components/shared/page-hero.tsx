import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PhoneLink } from "@/components/shared/phone-link";

/** Interior-page hero. Night surface, same shape on every page so the site
 *  reads as one system rather than a set of one-offs. */
export function PageHero({
  eyebrow,
  title,
  intro,
  primary = { label: "Get a free estimate", href: "/free-estimate" },
  secondary,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="surface-night relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(55%_100%_at_50%_100%,var(--color-glow-500)_0%,transparent_72%)] opacity-[0.12]"
      />
      <div className="container-site relative py-20 lg:py-24">
        <p className="font-display text-xs tracking-[0.18em] text-glow-500 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-steel-300">{intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={primary.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-glow-500 px-6 py-3.5 font-semibold text-night-950 transition-colors hover:bg-glow-400"
          >
            {primary.label}
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center rounded-lg border border-night-700 px-6 py-3.5 font-semibold text-steel-100 transition-colors hover:border-glow-500/50 hover:text-glow-400"
            >
              {secondary.label}
            </Link>
          ) : null}
          <PhoneLink className="justify-center px-2 py-3.5 text-steel-300 transition-colors hover:text-glow-400 sm:ml-2" />
        </div>
      </div>
    </section>
  );
}
