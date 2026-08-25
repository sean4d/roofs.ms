import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

export function LegalPage({
  title,
  path,
  sections,
}: {
  title: string;
  path: string;
  sections: { heading: string; body: string }[];
}) {
  const trail = [
    { name: "Home", path: "/" },
    { name: title, path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <section className="pt-32 pb-8">
        <div className="container-site">
          <h1 className="text-[2.2rem] leading-tight font-semibold sm:text-4xl">
            {title}
          </h1>
        </div>
      </section>
      <Breadcrumbs trail={trail} />
      <div className="container-site max-w-3xl py-14">
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className="text-bone-400 mt-3 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
