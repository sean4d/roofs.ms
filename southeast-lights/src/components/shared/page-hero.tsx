import Image from "next/image";
import Link from "next/link";

import { CallLink } from "@/components/shared/contact-actions";
import { QuoteButton } from "@/components/shared/quote-button";
import type { SiteImage } from "@/config/images";

/**
 * Interior page hero. Same shape everywhere so the site reads as one system
 * rather than a set of one-offs, with the image carried through next/image so
 * every page gets responsive formats and an LQIP blur.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  secondary,
  quoteLocation,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image: SiteImage;
  secondary?: { label: string; href: string };
  quoteLocation: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        style={{ objectPosition: image.focus ?? "center" }}
        className="-z-10 object-cover"
      />
      <div className="scrim-hero absolute inset-0 -z-10" />

      <div className="container-site relative flex min-h-[52svh] flex-col justify-end pt-32 pb-14 sm:min-h-[56svh] lg:min-h-[64svh] lg:pb-20">
        <p className="eyebrow text-champagne-400">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-[1.95rem] leading-[1.1] font-semibold text-balance sm:text-4xl lg:text-6xl lg:leading-[1.05]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-bone-300 sm:text-lg">
          {intro}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <QuoteButton location={quoteLocation} className="w-full sm:w-auto" />
          {secondary ? (
            <Link
              href={secondary.href}
              className="btn-secondary w-full sm:w-auto"
            >
              {secondary.label}
            </Link>
          ) : null}
          <CallLink className="justify-center px-2 py-3.5 text-bone-300 transition-colors hover:text-champagne-300 sm:ml-2" />
        </div>
      </div>
    </section>
  );
}
