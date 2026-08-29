import Image from "next/image";

import { CallLink, TextLink } from "@/components/shared/contact-actions";
import { QuoteButton } from "@/components/shared/quote-button";
import { IMAGES } from "@/config/images";
import { messagingFor, type SeasonMode } from "@/config/season";
import { siteConfig } from "@/config/site";

export function FinalCta({ mode, now }: { mode: SeasonMode; now: Date }) {
  const messaging = messagingFor(mode, now);
  const image =
    mode === "holiday" ? IMAGES.estateWide : IMAGES.landscapeLighting;

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={image.src}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className="-z-10 object-cover"
      />
      <div className="scrim absolute inset-0 -z-10" />

      <div className="container-site relative py-24 lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-champagne-400">{messaging.badge}</p>
          <h2 className="mt-4 text-3xl font-semibold text-balance sm:text-5xl lg:leading-[1.08]">
            {mode === "holiday"
              ? "Let's get your property on the schedule."
              : "Let's light it properly, all year."}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-bone-300">
            Send us the address and roughly what you have in mind. We will
            design it, price it, and give you one number for the whole season.
          </p>
          <p className="mt-3 text-sm text-bone-500">
            {siteConfig.responseTime}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuoteButton location="final_cta" className="px-7 py-4 text-base" />
            <TextLink className="btn-secondary px-7 py-4 text-base" />
            <CallLink className="justify-center px-2 py-4 text-bone-300 transition-colors hover:text-champagne-300 sm:ml-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
