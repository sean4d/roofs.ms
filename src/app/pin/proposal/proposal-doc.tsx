import { siteConfig } from "@/config/site";
import { rateCard } from "@/config/quote-rates";
import { summarizeStorms, longDate } from "@/lib/quotes/storms";
import type { ProposalData } from "@/lib/quotes/save";

/**
 * The document a homeowner actually receives.
 *
 * Written to be read by somebody standing at their own front door holding a
 * piece of paper, or opening a link on a phone. It has to do three jobs in
 * about fifteen seconds: say who we are and that we are real, say what their
 * roof is and what it costs, and make the next step obvious.
 *
 * EVERY CLAIM HERE COMES FROM siteConfig.trustFacts VERBATIM. Those strings
 * are the owner's own approved wording and they carry constraints that are not
 * obvious: "lifetime warranty" is deliberately unspecific because it is the
 * MANUFACTURER's warranty and not workmanship, and the experience line must
 * keep the word "combined" because the company was founded in 2023. Do not
 * paraphrase, tighten or embellish any of them. A proposal is the document a
 * customer will hold us to.
 *
 * The price is presented with its assumptions attached, in the same size type
 * as everything else. A number a homeowner cannot rely on is worse than no
 * number, and the assumptions are what make it one we can stand behind after
 * somebody has actually been on the roof.
 */

export function ProposalDoc({
  data,
  aerialSrc,
}: {
  data: ProposalData;
  aerialSrc: string;
}) {
  const t = siteConfig.trustFacts;
  const storms = summarizeStorms(data.lat, data.lon);
  const firm = data.priceShown !== null;
  const pitchOver12 =
    data.pitchDegrees === null
      ? null
      : Math.round(Math.tan((data.pitchDegrees * Math.PI) / 180) * 12 * 10) /
        10;

  const money = (n: number) => `$${n.toLocaleString()}`;

  return (
    <article className="proposal mx-auto w-full max-w-[8.5in] bg-white text-slate-900">
      {/* ---------- masthead ---------- */}
      <header className="flex items-start justify-between gap-6 border-b-[3px] border-[#123b63] px-8 pt-8 pb-5">
        <div>
          <h1 className="font-[family-name:var(--font-archivo)] text-2xl leading-none font-extrabold tracking-tight text-[#123b63]">
            {siteConfig.legalName}
          </h1>
          <p className="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
            Roof Replacement Estimate
          </p>
        </div>
        <div className="text-right text-[11px] leading-[1.7] text-slate-600">
          {siteConfig.address.streetAddress}
          <br />
          {siteConfig.address.addressLocality},{" "}
          {siteConfig.address.addressRegion} {siteConfig.address.postalCode}
          <br />
          <span className="font-bold text-[#123b63]">
            {siteConfig.phone.display}
          </span>
          <br />
          {siteConfig.email}
          <br />
          MSBOC #{siteConfig.license}
        </div>
      </header>

      {/* ---------- who this is for ---------- */}
      <section className="grid grid-cols-2 gap-6 px-8 pt-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            Prepared for
          </p>
          <p className="mt-1 text-[15px] font-semibold">
            {data.name ?? "Homeowner"}
          </p>
          <p className="text-[13px] leading-snug text-slate-700">
            {data.address}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            Date
          </p>
          <p className="mt-1 text-[13px]">
            {longDate(data.createdAt.slice(0, 10))}
          </p>
          <p className="mt-2 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            Estimate no.
          </p>
          <p className="font-mono text-[13px]">
            {data.quoteId.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </section>

      {/* ---------- the number ---------- */}
      <section className="mx-8 mt-6 rounded-lg bg-[#123b63] px-7 py-6 text-white">
        <p className="text-[10px] font-bold tracking-[0.14em] text-white/70 uppercase">
          Estimated investment
        </p>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-[42px] leading-none font-extrabold">
          {firm
            ? money(data.priceShown!)
            : `${money(data.priceLow)} to ${money(data.priceHigh)}`}
        </p>
        <p className="mt-2.5 text-[13px] text-white/85">
          Or about{" "}
          <span className="font-bold text-white">
            {money(data.monthlyLow)} a month
          </span>{" "}
          with financing. {t.financing}.
        </p>
        <p className="mt-1.5 text-[10px] leading-relaxed text-white/60">
          Example payment only: {money(firm ? data.priceShown! : data.priceLow)}{" "}
          over {rateCard.financing.months} months at{" "}
          {(rateCard.financing.apr * 100).toFixed(2)}% APR. Financing is
          provided by a third party and subject to credit approval. Your rate
          and term may differ.
        </p>
      </section>

      {/* ---------- their roof ---------- */}
      <section className="mt-7 px-8">
        <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          Your roof, measured
        </h2>
        <div className="mt-4 flex gap-6">
          <div className="grid flex-1 grid-cols-3 gap-y-4 self-start">
            <Fact label="Roof area" value={`${data.squares} squares`} />
            <Fact
              label="Pitch"
              value={pitchOver12 ? `${pitchOver12}:12` : "See inspection"}
            />
            <Fact label="Roof planes" value={String(data.planes)} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aerialSrc}
            alt="Aerial view of the roof"
            className="h-[150px] w-[150px] shrink-0 rounded border border-slate-300 object-cover"
          />
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          {data.imageryDate
            ? `Measured from aerial imagery of your property photographed ${longDate(data.imageryDate.slice(0, 10))}, not a guess from square footage.`
            : "Measured from aerial imagery of your property, not a guess from square footage."}{" "}
          One roofing square is 100 square feet. If the house has been added to
          since that photograph, tell us and we will remeasure.
        </p>
      </section>

      {/* ---------- what the price assumes ---------- */}
      <section className="mt-6 px-8">
        <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          What this price includes, and what it assumes
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5 text-[12px] leading-relaxed">
          <ul className="space-y-1.5">
            <Line>Tear off the existing roof and haul it away</Line>
            <Line>Architectural shingles, installed to manufacturer spec</Line>
            <Line>Synthetic underlayment, starter strip and ridge cap</Line>
            <Line>New pipe boots, drip edge and valley flashing</Line>
            <Line>Magnetic sweep of the property when we finish</Line>
            <Line>Permits and final inspection</Line>
          </ul>
          <ul className="space-y-1.5 text-slate-600">
            <Assumes>One existing layer of shingles</Assumes>
            <Assumes>Decking sound and not needing replacement</Assumes>
            <Assumes>Normal access for a truck and dumpster</Assumes>
            <Assumes>
              Chimney and skylight work, if any, quoted separately
            </Assumes>
          </ul>
        </div>
        <p className="mt-3.5 rounded border-l-[3px] border-[#123b63] bg-slate-50 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-700">
          <strong className="text-[#123b63]">
            This is an estimate, not a bid.
          </strong>{" "}
          It comes from aerial measurement and has not yet been verified on the
          roof. If an inspection finds a second layer, rotten decking or
          anything else outside the assumptions above, we will show you the
          problem, in writing, before any of it changes what you pay.
        </p>
      </section>

      {/* ---------- storm history, only when there is something true ---------- */}
      {storms.sentence && (
        <section className="mt-6 px-8">
          <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            Weather on record at this address
          </h2>
          <p className="mt-3 text-[12px] leading-relaxed">{storms.sentence}</p>
          {storms.events.filter((e) => e.damaging).length > 1 && (
            <ul className="mt-2 space-y-0.5">
              {storms.events
                .filter((e) => e.damaging)
                .slice(1, 4)
                .map((e) => (
                  <li
                    key={`${e.date}${e.label}`}
                    className="text-[11px] text-slate-600"
                  >
                    {longDate(e.date)} &middot; {e.label} &middot;{" "}
                    {e.distanceMi} miles away
                  </li>
                ))}
            </ul>
          )}
          <p className="mt-2.5 text-[10px] leading-relaxed text-slate-500">
            Source: {storms.source}, {storms.years[0]} to{" "}
            {storms.years[storms.years.length - 1]}. These are confirmed reports
            near the address, not a finding of damage to your roof. An
            inspection is what establishes that.
          </p>
        </section>
      )}

      {/* ---------- why us ---------- */}
      <section className="mt-6 px-8">
        <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          Who you would be hiring
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-[12px]">
          <Credential>
            {t.licensed}, MSBOC #{siteConfig.license}
          </Credential>
          <Credential>{t.insured}</Credential>
          <Credential>{t.bbbRating}</Credential>
          <Credential>{t.googleRating}</Credential>
          <Credential>{t.warranty}</Credential>
          <Credential>{t.experience}</Credential>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
          Based in {siteConfig.address.addressLocality} since{" "}
          {siteConfig.foundingYear}, working across the Pine Belt and the Gulf
          Coast. Our license and our BBB and GAF records are public and you are
          welcome to check every one of them before you call us back.
        </p>
      </section>

      {/* ---------- next step ---------- */}
      <section className="mt-7 border-t-2 border-[#123b63] px-8 pt-5 pb-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-[17px] font-extrabold text-[#123b63]">
              The next step is a free inspection.
            </p>
            <p className="mt-1.5 max-w-[4.6in] text-[12px] leading-relaxed text-slate-700">
              No cost and no obligation. We go up, photograph what is actually
              there, and turn this estimate into a firm price. If your roof has
              years left in it, we will tell you that instead.
            </p>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-archivo)] text-[21px] leading-none font-extrabold text-[#123b63]">
              {siteConfig.phone.display}
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              {new URL(siteConfig.url).hostname}
            </p>
          </div>
        </div>
        <p className="mt-5 text-[9.5px] leading-relaxed text-slate-400">
          Estimate {data.quoteId.slice(0, 8).toUpperCase()} prepared{" "}
          {longDate(data.createdAt.slice(0, 10))} by {data.repName}. Valid 30
          days. Roof measurement derived from aerial imagery and subject to
          on-site verification. {siteConfig.legalName}, MSBOC #
          {siteConfig.license}, {siteConfig.address.streetAddress},{" "}
          {siteConfig.address.addressLocality},{" "}
          {siteConfig.address.addressRegion} {siteConfig.address.postalCode}.
        </p>
      </section>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-[family-name:var(--font-archivo)] text-[19px] font-bold text-[#123b63]">
        {value}
      </p>
    </div>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="mt-[1px] font-bold text-[#123b63]">
        &#10003;
      </span>
      <span>{children}</span>
    </li>
  );
}

function Assumes({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="mt-[1px] text-slate-400">
        &bull;
      </span>
      <span>{children}</span>
    </li>
  );
}

function Credential({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span aria-hidden className="font-bold text-[#123b63]">
        &#10003;
      </span>
      <span>{children}</span>
    </div>
  );
}
