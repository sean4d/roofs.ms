import { siteConfig } from "@/config/site";

/**
 * Page three: how a storm claim actually works.
 *
 * Condensed from the site's own insurance-claims page, which the owner has
 * already reviewed, and it keeps that page's most important quality: it does
 * not promise anything. The copy there says plainly that the decision belongs
 * to the insurer and that any roofer who guarantees approval is selling
 * something. On a document a homeowner keeps, that restraint is the selling
 * point. A contractor who tells you what they cannot do is the one you believe
 * about what they can.
 *
 * Nothing here is legal advice or an interpretation of anybody's policy, and
 * it says so, because a proposal that implied otherwise would be a liability
 * rather than a marketing piece.
 */
export function InsurancePage() {
  return (
    <section className="proposal-page break-before-page px-5 pt-5 pb-3 sm:px-8 print:px-8">
      <header className="border-b-[3px] border-[#123b63] pb-2.5">
        <h2 className="font-[family-name:var(--font-archivo)] text-[18px] font-extrabold tracking-tight text-[#123b63]">
          If this is storm damage, here is how a claim works
        </h2>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
          What to expect, and what we can and cannot do
        </p>
      </header>

      <p className="mt-3 text-[11.5px] leading-relaxed text-slate-700">
        A storm claim is paperwork stapled to a roof. We handle both: thorough
        inspection reports, photos in the format adjusters expect, and someone
        on your side of the table at the adjuster meeting.
      </p>

      <div className="mt-3 rounded border-l-[3px] border-[#123b63] bg-slate-50 px-4 py-2">
        <p className="text-[11.5px] leading-relaxed text-slate-800">
          <strong className="text-[#123b63]">The honest version.</strong> The
          decision belongs to your insurance company, not to us. Any roofer who
          guarantees your claim will be approved is selling something. What a
          good contractor does is make sure the damage is found, documented and
          presented so the insurer can evaluate it fairly, and that nothing gets
          missed because nobody competent climbed the roof.
        </p>
      </div>

      <h3 className="mt-4 border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
        The claim, step by step
      </h3>
      <ol className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2 print:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-2.5">
            <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#123b63] text-[9px] font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[11px] leading-snug">
              <strong className="text-[#123b63]">{s.title}.</strong> {s.body}
            </span>
          </li>
        ))}
      </ol>

      <h3 className="mt-4 border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
        The words on your paperwork
      </h3>
      <dl className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1 text-[10.5px] leading-snug sm:grid-cols-2 print:grid-cols-2">
        {TERMS.map((t) => (
          <div key={t.term}>
            <dt className="font-bold text-[#123b63]">{t.term}</dt>
            <dd className="text-slate-700">{t.body}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-4 border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
        Have these ready and the whole thing moves faster
      </h3>
      <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-0.5 text-[10.5px] leading-snug text-slate-700 sm:grid-cols-3 print:grid-cols-3">
        {CHECKLIST.map((c) => (
          <li key={c} className="flex gap-2">
            <span aria-hidden className="text-[#123b63]">
              &#9633;
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-slate-200 pt-2 text-[9px] leading-relaxed text-slate-500">
        General information about how the process typically works. It is not
        legal advice and not an interpretation of your policy. Your policy
        language and your insurer&rsquo;s decisions control, and timelines
        depend on your insurer and on regional storm volume, so nobody can
        honestly promise you a date. Fuller version at{" "}
        {new URL(siteConfig.url).hostname}/storm-damage/insurance-claims.
      </p>
    </section>
  );
}

/** The ten steps from the site, tightened to fit a printed page. */
const STEPS = [
  {
    title: "Inspection and documentation",
    body: "We photograph every impact point, slope by slope. This is the record everything else is built on.",
  },
  {
    title: "An honest recommendation",
    body: "We tell you whether it looks like storm damage worth reporting, including when it does not.",
  },
  {
    title: "You file the claim",
    body: "The claim is yours to open. We supply the documentation and help you describe the loss accurately.",
  },
  {
    title: "Adjuster inspection",
    body: "Your insurer sends an adjuster. We meet them on the roof so the walk covers everything we found.",
  },
  {
    title: "Scope review",
    body: "The insurer issues a scope of loss. We check it against the roof's real condition and flag omissions.",
  },
  {
    title: "Our proposal",
    body: "A written proposal aligned to the approved scope, with materials and options spelled out.",
  },
  {
    title: "Supplements where supported",
    body: "If covered conditions surface that the scope missed, we document them and submit a supplement.",
  },
  {
    title: "Contract and materials",
    body: "You sign, choose colors and products, and we order materials and set the schedule.",
  },
  {
    title: "The work gets done",
    body: "We build to the approved scope. Most homes are finished in one to two days on site.",
  },
  {
    title: "Final documents",
    body: "Completion paperwork and the final invoice go to you and your insurer, with the depreciation request where your policy allows it.",
  },
];

const TERMS = [
  {
    term: "ACV",
    body: "Actual Cash Value: the depreciated value of the roof at the time of loss.",
  },
  {
    term: "RCV",
    body: "Replacement Cost Value: what it costs to replace the roof today, before depreciation.",
  },
  {
    term: "Deductible",
    body: "Your contracted share of a covered loss. No honest contractor offers to absorb it.",
  },
  {
    term: "Depreciation",
    body: "Value lost to age and wear. Under many RCV policies it is released after the work is documented.",
  },
  {
    term: "Scope of loss",
    body: "The insurer's written, line-by-line list of the work it agrees the damage requires.",
  },
  {
    term: "Supplement",
    body: "A documented request to adjust the scope when covered conditions turn up that it missed.",
  },
];

const CHECKLIST = [
  "The date, and roughly the time, of the storm",
  "Photos of anything visible: stains, debris, dented gutters",
  "Your policy number and your insurer's claims line",
  "Notes on when you first noticed each problem",
  "Receipts for emergency work already done",
  "Records of past roof work, if you have them",
];
