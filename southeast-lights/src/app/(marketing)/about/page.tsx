import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { IMAGES } from "@/config/images";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Southeast Lights | The Lighting Division of Southeast Roofing",
  description:
    "Southeast Lights is the lighting division of Southeast Roofing LLC, a licensed Mississippi roofing contractor. Roof-trained crews, professional equipment, and full-service holiday and permanent lighting.",
  path: "/about",
});

export default function AboutPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="About"
        title="A contracting company that happens to hang lights."
        intro="Southeast Lights is the lighting division of Southeast Roofing LLC. Same owner, same license, same insurance, same crews."
        image={IMAGES.crewBoomLift}
        quoteLocation="about"
      />
      <Breadcrumbs trail={trail} />

      <Section eyebrow="Who we are" title="One company, two names.">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-bone-300">
            <p>
              Southeast Lights is a registered trade name of{" "}
              {siteConfig.parent.name}, a licensed Mississippi roofing
              contractor based in Hattiesburg. Not a partner company, not a
              subsidiary. The same legal entity, operating under a second name
              for the lighting side of the business.
            </p>
            <p>
              That distinction matters more than it sounds. When you ask whether
              we are insured, the answer is not that someone else is. It is the
              same policy that covers our roofing crews. The same license. The
              same people.
            </p>
            <p>
              Holiday lighting turned out to be a natural extension of roofing
              rather than a novelty. Our crews are already on roofs every week
              of the year. They know how to read a pitch, where a ladder can
              safely be set, how to walk a steep slope without damaging
              shingles, and which attachment points will not cause a leak in
              March. Most people hanging Christmas lights are learning those
              things on your roof.
            </p>
            <p>
              We built the lighting business around that advantage. Roof-trained
              crews, professional equipment, commercial-grade materials, and a
              service model that means the display is our responsibility from
              design through storage rather than yours the moment we drive away.
            </p>
            <p>
              We are also not trying to be the cheapest. Professional lighting
              costs real money, and we would rather explain why than compete
              with a truck and a ladder.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card">
              <Image
                src={IMAGES.installerRoof.src}
                alt={IMAGES.installerRoof.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL={IMAGES.installerRoof.blurDataURL}
                className="object-cover"
              />
            </div>
            <div className="card-lit p-6">
              <h2 className="text-sm font-semibold text-bone-100">
                The details
              </h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-bone-500">Legal entity</dt>
                  <dd className="text-bone-200">
                    {siteConfig.legalName} d/b/a {siteConfig.name}
                  </dd>
                </div>
                {siteConfig.foundingYear ? (
                  <div>
                    <dt className="text-bone-500">Serving South Mississippi</dt>
                    <dd className="text-bone-200">
                      Since {siteConfig.foundingYear}
                    </dd>
                  </div>
                ) : null}
                {siteConfig.parent.license ? (
                  <div>
                    <dt className="text-bone-500">MS contractor license</dt>
                    <dd className="text-bone-200">
                      #{siteConfig.parent.license}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-bone-500">Based in</dt>
                  <dd className="text-bone-200">
                    {siteConfig.address.addressLocality},{" "}
                    {siteConfig.address.addressRegion}
                  </dd>
                </div>
                <div>
                  <dt className="text-bone-500">BBB</dt>
                  <dd className="text-bone-200">
                    {siteConfig.parent.bbb.rating}, accredited as{" "}
                    {siteConfig.parent.bbb.attributedTo}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Section>

      <Section
        tone="raised"
        eyebrow="Southeast Roofing"
        title="Need a roof while we're up there?"
        intro="Our crews are on your roof anyway. If they see something that needs attention, they will tell you, and the roofing side of the business can handle it."
      >
        <a href={siteConfig.parent.url} className="btn-secondary">
          Visit {siteConfig.parent.name}
        </a>
      </Section>

      <CtaBand
        title="Let's talk about your property."
        body="Call, text, or send the address. If we are not the right fit for the job, we will tell you that too."
        location="about_cta"
      />
    </>
  );
}
