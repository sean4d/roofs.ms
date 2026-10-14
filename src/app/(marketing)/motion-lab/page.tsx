import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { hero, processSection, whyUs } from "@/content/homepage";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { WordReveal } from "@/components/motion/word-reveal";
import { MarkerHighlight } from "@/components/motion/marker-highlight";
import { ImageWipe } from "@/components/motion/image-wipe";
import {
  ScrollRail,
  RailLine,
  RailStep,
} from "@/components/motion/scroll-rail";
import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxMedia } from "@/components/motion/parallax-media";

/**
 * MOTION LAB, INTERNAL. Not linked from anywhere, not in the sitemap, and
 * noindexed. It exists so the owner can see each proposed animation running
 * on this site's own type, colour and photographs before any of it is wired
 * into a real page, and so the recorded previews are of the real thing
 * rather than of someone else's demo reel.
 *
 * Each block below is the real markup from the section it would land in,
 * with one effect added. Delete this route once the approved effects are
 * wired in; nothing in production imports it.
 */
export const metadata: Metadata = buildMetadata({
  title: "Motion lab (internal)",
  description: "Internal preview of proposed site animations.",
  path: "/motion-lab",
  noIndex: true,
});

function Label({ n, name, where }: { n: number; name: string; where: string }) {
  return (
    <div className="container-site">
      <div className="mb-8 border-b border-border pb-4">
        <p className="text-xs font-semibold tracking-widest text-steel-500 uppercase">
          Preview {n}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-navy-900">
          {name}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{where}</p>
      </div>
    </div>
  );
}

export default function MotionLabPage() {
  return (
    <>
      <div className="border-b border-border bg-secondary py-10">
        <div className="container-site">
          <p className="text-xs font-semibold tracking-widest text-steel-500 uppercase">
            Internal, not published
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy-900">
            Motion lab
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Six proposed animations, each running on real Southeast Roofing
            content. Nothing here is live on the site.
          </p>
        </div>
      </div>

      {/* 1. Masked word reveal, hero headline */}
      <Label
        n={1}
        name="Masked word reveal"
        where="Homepage hero headline, and the H2 on each service page."
      />
      <section
        data-preview="word-reveal"
        className="relative flex min-h-[70svh] items-center overflow-hidden bg-navy-950"
      >
        <Image
          src={hero.photo.src}
          alt={hero.photo.alt}
          fill
          quality={65}
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/65 to-navy-900/20"
        />
        <div className="container-site relative w-full py-20">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold tracking-wide text-steel-300 uppercase">
              Residential &amp; commercial roofing contractor in{" "}
              {siteConfig.address.addressLocality},{" "}
              {siteConfig.address.addressRegion}
            </p>
            <WordReveal
              as="p"
              text={`${hero.headline.lead} ${hero.headline.accent}`}
              /* "right." keeps its steel tone, exactly as the live hero. */
              accentFrom={hero.headline.lead.split(/\s+/).length}
              className="mt-3 font-display text-[2.5rem] leading-[1.06] font-bold text-white sm:text-5xl lg:text-6xl"
            />
            <WordReveal
              as="p"
              text="Mississippi licensed on both sides of the trade, and based here in Hattiesburg."
              delay={0.35}
              stagger={0.025}
              className="mt-5 max-w-xl text-lg leading-relaxed text-steel-100 sm:text-xl"
            />
          </div>
        </div>
      </section>

      {/* 2. Marker highlight */}
      <Label
        n={2}
        name="Marker highlight"
        where="One claim per section: the free inspection, the warranty, the licence."
      />
      <Section tone="surface">
        <div
          data-preview="marker-highlight"
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold tracking-wide text-steel-500 uppercase">
            How it works
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Every roof starts with a{" "}
            <MarkerHighlight>free inspection</MarkerHighlight>
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {processSection.description}
          </p>
          {/* Same effect, the warmer brand colour, so the two can be
              compared side by side before one is chosen. */}
          <h3 className="mt-14 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Backed by a{" "}
            <MarkerHighlight
              delay={0.4}
              color="color-mix(in srgb, var(--color-ember-500, #c9702e) 42%, transparent)"
            >
              10-year workmanship warranty
            </MarkerHighlight>
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            The warmer option. Same stroke, brand ember at 42%.
          </p>
        </div>
      </Section>

      {/* 3. Wipe reveal on a photograph */}
      <Label
        n={3}
        name="Wipe reveal"
        where="Project gallery cards, the Why Us photo, city page imagery."
      />
      <Section>
        <div
          data-preview="image-wipe"
          className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2"
        >
          <ImageWipe className="shadow-premium rounded-2xl" from="bottom">
            <Image
              src={whyUs.photo.src}
              alt={whyUs.photo.alt}
              width={1000}
              height={750}
              quality={70}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </ImageWipe>
          <ImageWipe
            className="shadow-premium rounded-2xl"
            from="left"
            delay={0.15}
          >
            <Image
              src={hero.photo.src}
              alt={hero.photo.alt}
              width={1000}
              height={750}
              quality={70}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </ImageWipe>
        </div>
      </Section>

      {/* 4. Scroll-filled process rail */}
      <Label
        n={4}
        name="Process rail"
        where="The five-step process on the homepage and on every service page."
      />
      <Section tone="surface">
        <div data-preview="scroll-rail">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              {processSection.title}
            </h3>
          </div>
          <ScrollRail
            as="ul"
            count={processSection.steps.length}
            className="relative mx-auto mt-14 grid max-w-md gap-8 lg:max-w-none lg:grid-cols-5 lg:gap-6"
          >
            <div
              aria-hidden="true"
              className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-border lg:block"
            />
            <RailLine
              orientation="horizontal"
              className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-primary lg:block"
            />
            {processSection.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-5 lg:flex-col lg:gap-0 lg:text-center"
              >
                <div className="relative flex flex-col items-center lg:mb-5">
                  <RailStep
                    index={index}
                    ringClassName="rounded-full ring-2 ring-primary"
                  >
                    <span className="shadow-premium relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-white">
                      <step.icon
                        className="size-5 text-steel-500"
                        aria-hidden="true"
                      />
                    </span>
                  </RailStep>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-steel-500 uppercase">
                    Step {index + 1}
                  </p>
                  <h4 className="mt-1 font-display text-lg font-semibold">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ScrollRail>
        </div>
      </Section>

      {/* 5. Magnetic CTA */}
      <Label
        n={5}
        name="Magnetic buttons"
        where="Primary calls to action. Mouse only, never on a touchscreen. Shown at 10px of travel so it reads on video; 6px is the default."
      />
      <Section>
        <div
          data-preview="magnetic"
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 py-10 text-center sm:flex-row sm:justify-center"
        >
          <Magnetic strength={10}>
            <Button
              size="xl"
              className="bg-primary text-white"
              render={<Link href={siteConfig.links.instantEstimate} />}
              nativeButton={false}
            >
              <Zap className="size-5" aria-hidden="true" />
              Free Instant Estimate
            </Button>
          </Magnetic>
          <Magnetic strength={10}>
            <Button
              size="xl"
              variant="outline"
              render={<Link href="/contact" />}
              nativeButton={false}
            >
              Free Inspection
              <ArrowRight aria-hidden="true" />
            </Button>
          </Magnetic>
        </div>
      </Section>

      {/* 6. Parallax media */}
      <Label
        n={6}
        name="Parallax photograph"
        where="One image per page, where there is room: Why Us, About, city pages."
      />
      <Section tone="surface">
        <div
          data-preview="parallax"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div>
            <p className="text-sm font-semibold tracking-wide text-steel-500 uppercase">
              {whyUs.eyebrow}
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              {whyUs.title}
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {whyUs.description}
            </p>
          </div>
          <ParallaxMedia
            className="shadow-premium h-[26rem] rounded-2xl"
            distance={56}
          >
            <Image
              src={whyUs.photo.src}
              alt={whyUs.photo.alt}
              width={1000}
              height={750}
              quality={70}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full object-cover"
            />
          </ParallaxMedia>
        </div>
      </Section>

      <div className="border-t border-border py-16">
        <div className="container-site text-center text-sm text-slate-600">
          End of previews. Nothing on this page is live on the site.
        </div>
      </div>
    </>
  );
}
