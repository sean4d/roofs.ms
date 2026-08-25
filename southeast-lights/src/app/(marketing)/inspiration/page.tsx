import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { IMAGES, type SiteImage } from "@/config/images";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Design Inspiration",
  description:
    "Holiday and architectural lighting design ideas: classic warm white, full-property estate displays, wrapped trees, commercial installations and color schemes.",
  path: "/inspiration",
});

/**
 * Design inspiration.
 *
 * Doing real work rather than being a mood board: each style names what it
 * costs to achieve and what it suits, so a homeowner self-selects upward
 * instead of assuming the cheapest option is the default.
 */
const STYLES: {
  name: string;
  image: SiteImage;
  body: string;
  suits: string;
}[] = [
  {
    name: "Classic Warm White",
    image: IMAGES.colonialColumns,
    body: "Warm white C9 on every roofline, nothing else competing. The look that reads as expensive from the road and never dates. About three quarters of what we install.",
    suits:
      "Traditional and colonial architecture, brick, anything with good trim.",
  },
  {
    name: "Full Property",
    image: IMAGES.estateWide,
    body: "Roofline, columns, windows, wrapped trees, lit beds and pathway stakes treated as one composition rather than separate purchases.",
    suits: "Larger homes where the grounds matter as much as the house.",
  },
  {
    name: "Tree-Led",
    image: IMAGES.liveOakWrap,
    body: "Where a property has a mature live oak, the tree is the display and the house is the backdrop. Full trunk and limb wrapping on a century oak is the most dramatic thing we do.",
    suits: "Properties with specimen hardwoods, deep lots, long driveways.",
  },
  {
    name: "Architectural",
    image: IMAGES.permanentHero,
    body: "Permanent LED washing the facade in warm white, on every evening rather than six weeks a year. Color available when you want it.",
    suits: "Contemporary architecture, and anyone tired of a seasonal cycle.",
  },
  {
    name: "Color",
    image: IMAGES.permanentColor,
    body: "Red and green, red and white, or full multicolor. Color costs the same as warm white, and we will tell you honestly which suits your elevation.",
    suits:
      "Family homes, properties with children, anywhere with a playful brief.",
  },
  {
    name: "Commercial Scale",
    image: IMAGES.retailCenter,
    body: "Long parapets, wrapped parking-island trees, lit columns and entry canopies, installed with lift equipment and maintained on a schedule.",
    suits: "Retail centers, offices, hospitality and campuses.",
  },
  {
    name: "Community Entrance",
    image: IMAGES.hoaEntrance,
    body: "Monument walls, landscaped beds and boulevard trees designed so the display reads continuously as residents turn in.",
    suits: "HOAs, master-planned communities, neighborhood associations.",
  },
  {
    name: "Bistro & Patio",
    image: IMAGES.bistroPatio,
    body: "Overhead string lighting properly tensioned so it stays straight, for courtyards and outdoor dining that works all year.",
    suits: "Restaurants, bars, event venues, residential patios.",
  },
  {
    name: "Mardi Gras",
    image: IMAGES.mardiGras,
    body: "Purple, green and gold on rooflines, balconies, columns and trees. A genuine second season on the Coast.",
    suits: "Gulf Coast businesses, hospitality and communities.",
  },
];

export default function InspirationPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Design Inspiration", path: "/inspiration" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Inspiration"
        title="Nine ways to light a property."
        intro="Most people picture one thing when they think about Christmas lights. These are the directions worth considering before you decide."
        image={IMAGES.estateWide}
        quoteLocation="inspiration"
        secondary={{ label: "Build your own", href: "/estimator" }}
      />
      <Breadcrumbs trail={trail} />

      <Section eyebrow="Styles" title="">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STYLES.map((style) => (
            <article
              key={style.name}
              className="card-lit flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={style.image.src}
                  alt={style.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={style.image.blurDataURL}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="text-lg font-semibold">{style.name}</h2>
                <p className="text-bone-400 text-sm leading-relaxed">
                  {style.body}
                </p>
                <p className="mt-auto pt-2 text-xs leading-relaxed text-champagne-300">
                  Suits: {style.suits}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Found one you like?"
        body="Tell us which and send your address. We will show you what it looks like on your property."
        location="inspiration_cta"
      />
    </>
  );
}
