import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQS, faqsByCategory, type FaqCategory } from "@/config/faqs";
import { IMAGES } from "@/config/images";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about professional Christmas light installation: what it costs, what is included, who owns the lights, roof safety, scheduling, takedown, storage and permanent lighting.",
  path: "/faq",
});

const SECTIONS: { key: FaqCategory; title: string }[] = [
  { key: "pricing", title: "Pricing" },
  { key: "service", title: "The service" },
  { key: "roof", title: "Your roof" },
  { key: "scheduling", title: "Scheduling, takedown & storage" },
  { key: "permanent", title: "Permanent lighting" },
  { key: "commercial", title: "Commercial & HOA" },
  { key: "coverage", title: "Coverage & logistics" },
];

export default function FaqPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <>
      {/* Every question below is rendered on this page, so schema is honest. */}
      <JsonLd data={[breadcrumbSchema(trail), faqSchema(FAQS)]} />
      <PageHero
        eyebrow="Questions"
        title="Straight answers."
        intro="What it costs, what is included, whether we will damage your roof, and everything else people actually ask before booking."
        image={IMAGES.c9Detail}
        quoteLocation="faq"
      />
      <Breadcrumbs trail={trail} />

      {SECTIONS.map((section, index) => {
        const items = faqsByCategory(section.key);
        if (items.length === 0) return null;
        return (
          <Section
            key={section.key}
            tone={index % 2 === 0 ? "ink" : "raised"}
            eyebrow={section.title}
            title=""
          >
            <FaqList items={items} />
          </Section>
        );
      })}

      <CtaBand
        title="Still have a question?"
        body="Text or call us. We would rather answer it directly than have you guess."
        location="faq_cta"
      />
    </>
  );
}
