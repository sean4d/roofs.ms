import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { whyUs } from "@/content/homepage";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { ImageWipe } from "@/components/motion/image-wipe";

/**
 * Why choose Southeast Roofing (PRD §3.8): honest local differentiators,
 * paired with a real project photo.
 */
export function WhyUs() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={whyUs.eyebrow}
            title={whyUs.title}
            description={whyUs.description}
          />

          <StaggerGroup className="mt-10 space-y-6">
            {whyUs.points.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} className="flex gap-4">
                <span className="flex-none rounded-xl bg-accent p-3">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
            >
              More about Southeast Roofing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {/*
          The photo wipes up rather than fading in with the rest. It is the
          only image in this section, so it can carry a motion of its own
          without competing with anything; the rounded corners live on the
          wipe's clipping box, because clip-path on the inside of a rounded
          element would square the picture off while it ran.
        */}
        <ImageWipe
          className="shadow-premium aspect-[4/3] w-full rounded-3xl border border-border"
          from="bottom"
        >
          <Image
            src={whyUs.photo.src}
            alt={whyUs.photo.alt}
            width={1000}
            height={750}
            quality={70}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </ImageWipe>
      </div>
    </Section>
  );
}
