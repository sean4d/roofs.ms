import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

import type { BreadcrumbItem } from "@/lib/schema";
import type { CityContent } from "@/content/cities/types";
import { projectPhotos } from "@/content/photos";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { ServiceFaq } from "@/components/services/service-faq";
import { HelpPanel } from "@/components/services/help-panel";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { PhoneLink } from "@/components/shared/phone-link";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/home/final-cta";

/**
 * City service-area page template (PRD §5). Local proof first: when real
 * Southeast Roofing project photos exist for the city they lead the page —
 * the strongest anti-doorway signal there is.
 */

const CITY_SERVICES = [
  { label: "Roof Replacement", href: "/residential/roof-replacement" },
  { label: "Roof Repair", href: "/residential/roof-repair" },
  {
    label: "Asphalt Shingle Roofing",
    href: "/residential/asphalt-shingle-roofing",
  },
  { label: "Metal Roofing", href: "/residential/metal-roofing" },
  { label: "Storm Damage & Insurance", href: "/storm-damage" },
  { label: "Seamless Gutters", href: "/residential/gutters" },
  { label: "Commercial Roofing", href: "/commercial" },
];

export function CityPage({
  cityContent,
  breadcrumbs,
}: {
  cityContent: CityContent;
  breadcrumbs: BreadcrumbItem[];
}) {
  const localPhotos = projectPhotos.filter(
    (photo) =>
      photo.kind === "completed" && photo.citySlug === cityContent.slug,
  );
  const heroPhoto = localPhotos[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-secondary">
        <div className="container-site grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <MapPin
                  className="size-3.5 text-steel-500"
                  aria-hidden="true"
                />
                {cityContent.county}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
                <Clock className="size-3.5 text-steel-500" aria-hidden="true" />
                {cityContent.driveTime} from our Hattiesburg office
              </span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold text-navy-900 sm:text-5xl">
              {cityContent.hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              {cityContent.hero.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="xl"
                render={<Link href="/free-inspection" />}
                nativeButton={false}
              >
                Schedule Free Inspection
                <ArrowRight aria-hidden="true" />
              </Button>
              <PhoneLink className="text-base text-navy-900" />
            </div>
          </Reveal>

          {heroPhoto && (
            <Reveal delay={0.1} className="relative">
              <Image
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                width={1000}
                height={750}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="shadow-premium aspect-[4/3] w-full rounded-3xl border border-border object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-navy-950/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
                A real Southeast Roofing project in {cityContent.city}
              </span>
            </Reveal>
          )}
        </div>
      </section>

      {/* Local intro — the anti-doorway core */}
      <Section>
        <SectionHeading title={cityContent.intro.title} />
        <Reveal className="mt-6 max-w-3xl space-y-5">
          {cityContent.intro.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-lg leading-relaxed text-slate-600"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Section>

      {/* Local project proof */}
      {localPhotos.length > 1 && (
        <Section tone="surface">
          <SectionHeading
            eyebrow="Local proof"
            title={`Roofs we've completed in ${cityContent.city}`}
            description="Every photo below is a genuine Southeast Roofing project in this community — not stock, not staged."
          />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {localPhotos.slice(0, 4).map((photo) => (
              <StaggerItem as="div" key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={450}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>
      )}

      {/* Services in this city */}
      <Section tone={localPhotos.length > 1 ? "white" : "surface"}>
        <SectionHeading
          eyebrow="What we do here"
          title={`Roofing services in ${cityContent.city}`}
        />
        <StaggerGroup as="ul" className="mt-10 flex flex-wrap gap-3">
          {CITY_SERVICES.map((service) => (
            <StaggerItem as="li" key={service.href}>
              <Link
                href={service.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-md"
              >
                {service.label}
                <ArrowRight
                  className="size-3.5 text-steel-500"
                  aria-hidden="true"
                />
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {cityContent.localAreas && (
          <Reveal className="mt-12">
            <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              {cityContent.localAreas.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
              {cityContent.localAreas.items.map((area) => (
                <li
                  key={area}
                  className="rounded-full bg-secondary px-3.5 py-1.5 text-sm text-slate-600"
                >
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Section>

      {/* Storm context */}
      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-steel-300 uppercase">
              Storm country
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {cityContent.stormContext.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-100">
              {cityContent.stormContext.text}
            </p>
            <div className="mt-8">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-steel-100"
                render={<Link href="/storm-damage" />}
                nativeButton={false}
              >
                How our storm response works
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <ServiceFaq
        faqs={cityContent.faqs}
        title={`${cityContent.city} roofing questions, answered`}
      />
      <HelpPanel />
      <FinalCta />
    </>
  );
}
