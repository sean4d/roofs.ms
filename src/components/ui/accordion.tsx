import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * FAQ accordion built on native <details>/<summary>.
 *
 * Every place this component is used is an FAQ (homepage, service pages, and
 * the /faq hub), and <details> is the element the platform provides for exactly
 * that. Using it instead of a JS disclosure buys four things that matter here:
 *
 *  1. Answers ship in the server-rendered HTML and stay in the DOM. Our pages
 *     emit FAQPage structured data, and that markup has to mirror content that
 *     is genuinely on the page — schema whose answers exist only in JSON-LD
 *     reads as markup written for crawlers rather than people.
 *  2. It works with JavaScript disabled. Open/close is browser behaviour; there
 *     is no hydration step between the reader and the answer.
 *  3. Keyboard and screen-reader support are native — <summary> is focusable,
 *     Enter and Space toggle it, and state is exposed without any ARIA of ours.
 *  4. Find-in-page (Ctrl+F) locates text inside a closed answer and browsers
 *     expand it automatically.
 *
 * The API mirrors the previous component so call sites didn't change.
 */

function Accordion({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  /** Accepted for API compatibility with the previous implementation. */
  value: _value,
  ...props
}: React.ComponentPropsWithoutRef<"details"> & { value?: string }) {
  return (
    <details
      data-slot="accordion-item"
      className={cn("group/accordion-item not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"summary">) {
  return (
    <summary
      data-slot="accordion-trigger"
      className={cn(
        // list-none + ::-webkit-details-marker hides the default triangle so
        // our chevron is the only affordance.
        "flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none select-none",
        "hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "[&::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open/accordion-item:rotate-180"
      />
    </summary>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="accordion-content"
      className={cn(
        "pt-0 pb-2.5 text-sm [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
