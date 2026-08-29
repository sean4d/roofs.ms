import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { COVERAGE, SERVICE_AREAS } from "@/config/service-areas";

export function ServiceAreasBand() {
  return (
    <section className="band">
      <div className="container-site">
        <p className="eyebrow text-champagne-500">Where we work</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Hattiesburg and the Pine Belt, the Gulf Coast, and beyond for the
          right project.
        </h2>

        <div className="mt-8 grid max-w-4xl gap-6 sm:grid-cols-3">
          <Coverage label="Residential" body={COVERAGE.residential} />
          <Coverage label="Commercial" body={COVERAGE.commercial} />
          <Coverage label="Large projects" body={COVERAGE.large} />
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {SERVICE_AREAS.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/service-areas/${area.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-bone-300 transition-colors hover:border-champagne-400/40 hover:text-champagne-300"
              >
                {area.city}
                <ArrowUpRight className="size-3 opacity-50" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Coverage({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-champagne-300">{label}</h3>
      <div className="rule-lit my-3" />
      <p className="text-sm leading-relaxed text-bone-500">{body}</p>
    </div>
  );
}
