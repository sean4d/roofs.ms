import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PhoneLink } from "@/components/shared/phone-link";

export function CtaBand({
  title,
  body,
  cta = { label: "Get a free estimate", href: "/free-estimate" },
}: {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="surface-night border-t border-night-700 py-20">
      <div className="container-site flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-balance">{title}</h2>
          <p className="mt-4 text-steel-300">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={cta.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-glow-500 px-6 py-3.5 font-semibold text-night-950 transition-colors hover:bg-glow-400"
          >
            {cta.label}
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
          <PhoneLink className="justify-center px-2 py-3.5 text-steel-300 transition-colors hover:text-glow-400" />
        </div>
      </div>
    </section>
  );
}
