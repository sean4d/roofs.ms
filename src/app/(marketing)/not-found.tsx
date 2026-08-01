import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Branded 404. Many sitemap routes are planned but not yet built. */
export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-28 text-center">
      <span className="rounded-2xl border border-border bg-secondary p-4">
        <Construction className="size-8 text-steel-500" aria-hidden="true" />
      </span>
      <h1 className="mt-8 font-display text-4xl font-bold sm:text-5xl">
        This page is <span className="text-gradient-steel">on the roadmap</span>
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-slate-600">
        We&apos;re building this site out section by section. The page
        you&apos;re looking for either hasn&apos;t shipped yet or the address
        has changed.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button render={<Link href="/" />} nativeButton={false}>
          <ArrowLeft aria-hidden="true" />
          Back to home
        </Button>
        <Button
          render={<Link href="/contact" />}
          nativeButton={false}
          variant="outline"
        >
          Contact us
        </Button>
      </div>
    </section>
  );
}
