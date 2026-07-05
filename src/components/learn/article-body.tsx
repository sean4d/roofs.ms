import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ArticleBlock } from "@/content/learn/types";
import { GafWidget } from "@/components/learn/gaf-widget";
import { RoofAnatomy } from "@/components/services/roof-anatomy";
import { Reveal } from "@/components/motion/reveal";

/**
 * Block renderer for Learning Center articles — keeps guides visual and
 * scannable (owner directive: customers are visual learners) instead of
 * walls of prose.
 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="max-w-3xl">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "p":
            return (
              <p
                key={key}
                className="mt-6 text-lg leading-relaxed text-slate-600"
              >
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={key}
                className="mt-12 font-display text-2xl font-bold text-navy-900 sm:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "list":
            return (
              <div key={key} className="mt-6">
                {block.title && (
                  <p className="font-semibold text-navy-900">{block.title}</p>
                )}
                <ul className="mt-3 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-steel-500"
                      />
                      <span className="leading-relaxed text-slate-600">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "callout":
            return (
              <Reveal key={key} className="mt-10">
                <div className="rounded-2xl border border-border bg-secondary p-6 sm:p-7">
                  <p className="font-display text-lg font-bold text-navy-900">
                    {block.title}
                  </p>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {block.text}
                  </p>
                  {block.href && block.linkLabel && (
                    <Link
                      href={block.href}
                      className="mt-4 inline-flex items-center gap-1.5 font-semibold text-navy-900 underline-offset-4 hover:underline"
                    >
                      {block.linkLabel}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          case "widget":
            return (
              <GafWidget
                key={key}
                widget={block.widget}
                title={block.title}
                caption={block.caption}
              />
            );
          case "anatomy":
            return (
              <div key={key} className="mt-8">
                <RoofAnatomy />
              </div>
            );
        }
      })}
    </div>
  );
}
