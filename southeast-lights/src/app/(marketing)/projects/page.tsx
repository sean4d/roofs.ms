import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHero } from "@/components/shared/page-hero";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { IMAGES } from "@/config/images";
import { publishedProjects } from "@/config/projects";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lighting Projects",
  description:
    "Holiday and permanent lighting projects across South Mississippi: estates, HOA entrances, churches, hospitality properties and downtown districts.",
  path: "/projects",
});

export default function ProjectsPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ];
  const projects = publishedProjects();

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <PageHero
        eyebrow="Our work"
        title="Properties we've lit."
        intro="Estates, community entrances, churches, hospitality properties and downtown districts across South Mississippi and the Gulf Coast."
        image={IMAGES.estateWide}
        quoteLocation="projects_hub"
      />
      <Breadcrumbs trail={trail} />

      {projects.length > 0 ? (
        <ProjectGallery projects={projects} />
      ) : (
        <div className="container-site py-24">
          <p className="text-bone-400 max-w-xl text-lg">
            Project photography is being added. In the meantime, tell us about
            your property and we will show you comparable work directly.
          </p>
        </div>
      )}

      <CtaBand
        title="Want your property in here?"
        body="Tell us the address and what caught your eye. We will show you what the same treatment looks like on your elevation."
        location="projects_hub_cta"
      />
    </>
  );
}
