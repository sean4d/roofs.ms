/**
 * FAQ list. Uses native <details> so answers are in the DOM for crawlers and
 * work with JavaScript disabled.
 *
 * Worth remembering why this exists: the old Wix site's FAQ page rendered
 * four questions and only ONE answer. Three questions sat there with nothing
 * underneath them.
 */
export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="card-day group px-6 py-5 [&[open]]:border-steel-300"
        >
          <summary className="cursor-pointer list-none font-display font-semibold text-navy-900 marker:hidden">
            {item.question}
          </summary>
          <p className="mt-3 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
