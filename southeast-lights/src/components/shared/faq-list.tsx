import { Plus } from "lucide-react";

import type { Faq } from "@/config/faqs";

/**
 * FAQ list.
 *
 * Native <details> so every answer is in the DOM for crawlers and AI
 * assistants and works with JavaScript disabled. That matters more here than
 * anywhere else on the site: these answers are written to be quoted.
 *
 * Worth remembering why: the old Wix FAQ rendered four questions and exactly
 * one answer. Three questions sat there with nothing underneath them.
 */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details key={item.question} className="card-lit group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold text-bone-100 marker:hidden [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              className="mt-1 size-4 shrink-0 text-champagne-400 transition-transform duration-300 group-open:rotate-45"
              strokeWidth={2}
            />
          </summary>
          <p className="mt-4 max-w-3xl leading-relaxed text-bone-300">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
