import { siteConfig } from "@/config/site";
import {
  FINANCING,
  MATERIALS,
  paymentFor,
  type MaterialKey,
} from "@/config/quote-rates";
import { InlineSvg, logoSvg, qrSvg } from "./brand";
import { getProfile } from "@/lib/quotes/profile";
import { InsurancePage } from "./insurance-page";
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
 * EVERY CLAIM ON IT IS NOW OWNER-EDITABLE, from /pin/settings, and seeded from
 * siteConfig.trustFacts. Those seeds carry constraints that are not obvious
 * from reading them: "lifetime warranty" is deliberately unspecific because it
 * is the MANUFACTURER's warranty and not workmanship, and the experience line
 * must keep the word "combined" because the company was founded in 2023.
 * Whoever edits them is making a claim a customer can hold the company to,
 * which is why the settings screen says so next to the box.
 *
 * The price is presented with its assumptions attached, in the same size type
 * as everything else. A number a homeowner cannot rely on is worse than no
 * number, and the assumptions are what make it one we can stand behind after
 * somebody has actually been on the roof.
 */

export async function ProposalDoc({
  data,
  aerialSrc,
}: {
  data: ProposalData;
  aerialSrc: string;
}) {
  // Everything the office can edit. Falls back to site.ts field by field, so
  // this renders correctly before anybody has opened the settings screen.
  const profile = await getProfile();
  const logo = logoSvg();
  // Points at the homeowner's own copy when there is one, so a scan from a
  // mailed piece lands on their price rather than the front page.
  const qrTarget = data.publicToken
    ? `${siteConfig.url}/estimate/${data.publicToken}`
    : `${siteConfig.url}/free-inspection`;
  const qr = await qrSvg(qrTarget);
  const storms = summarizeStorms(data.lat, data.lon);
  const firm = data.priceShown !== null;
  const pitchOver12 =
    data.pitchDegrees === null
      ? null
      : Math.round(Math.tan((data.pitchDegrees * Math.PI) / 180) * 12 * 10) /
        10;

  const money = (n: number) => `$${n.toLocaleString()}`;
  // The material the rep actually chose. Falling back to architectural keeps
  // older quotes, written before the choice existed, readable.
  const materialLabel = (
    MATERIALS[data.material as MaterialKey]?.label ?? "Architectural shingle"
  ).replace(/ shingle$/, " shingles");

  return (
    <article className="proposal mx-auto w-full max-w-[8.5in] bg-white text-slate-900">
      {/* ---------- masthead ---------- */}
      <header className="flex items-start justify-between gap-6 border-b-[3px] border-[#123b63] px-8 pt-8 pb-5">
        <div className="flex items-center gap-3.5">
          {logo && (
            <InlineSvg svg={logo} className="block h-12 w-12 shrink-0" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-archivo)] text-2xl leading-none font-extrabold tracking-tight text-[#123b63]">
              {profile.legalName}
            </h1>
            <p className="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
              Roof Replacement Estimate
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] leading-[1.7] text-slate-600">
          {profile.street}
          <br />
          {profile.city}, {profile.state} {profile.postal}
          <br />
          <span className="font-bold" style={{ color: profile.accentColor }}>
            {profile.phone}
          </span>
          <br />
          {profile.email}
          <br />
          MSBOC #{profile.license}
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
        <div className="mt-4 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-white/70 uppercase">
              Or finance it. {profile.financingLine}
            </p>
            <div className="mt-2 flex gap-6">
              {FINANCING.termsMonths.map((months) => (
                <div key={months}>
                  <p className="font-[family-name:var(--font-archivo)] text-[21px] leading-none font-bold">
                    {money(
                      paymentFor(
                        firm ? data.priceShown! : data.priceLow,
                        months,
                      ),
                    )}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/70">
                    per month, {months / 12} years
                  </p>
                </div>
              ))}
            </div>
          </div>
          {qr && (
            <div className="shrink-0 rounded bg-white p-1.5">
              <InlineSvg svg={qr} className="block h-[74px] w-[74px]" />
            </div>
          )}
        </div>
        <p className="mt-3 text-[9.5px] leading-relaxed text-white/60">
          Example payments on {money(firm ? data.priceShown! : data.priceLow)}{" "}
          at {(FINANCING.apr * 100).toFixed(2)}% APR through our partner{" "}
          {FINANCING.partner}, subject to credit approval. Your rate and term
          may differ. Scan the code to open this estimate on your phone.
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
            <Fact
              label="Stories"
              value={data.stories ? `${data.stories}` : String(data.planes)}
            />
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
            <Line>{materialLabel}, installed to manufacturer spec</Line>
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
      {profile.showStorms && storms.sentence && (
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
          {profile.credentials.map((c) => (
            <Credential key={c}>{c}</Credential>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
          Based in {profile.city} since {siteConfig.foundingYear}, working
          across the Pine Belt and the Gulf Coast. Our license and our BBB and
          GAF records are public and you are welcome to check every one of them
          before you call us back.
        </p>
      </section>

      {/* ---------- next step ---------- */}
      <section className="mt-7 border-t-2 border-[#123b63] px-8 pt-5 pb-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-[17px] font-extrabold text-[#123b63]">
              {profile.headline}
            </p>
            <p className="mt-1.5 max-w-[4.6in] text-[12px] leading-relaxed text-slate-700">
              {profile.closingLine}
            </p>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-archivo)] text-[21px] leading-none font-extrabold text-[#123b63]">
              {profile.phone}
            </p>
            <p className="mt-1 text-[11px] text-slate-600">{profile.website}</p>
          </div>
        </div>
        <p className="mt-5 text-[9.5px] leading-relaxed text-slate-400">
          Estimate {data.quoteId.slice(0, 8).toUpperCase()} prepared{" "}
          {longDate(data.createdAt.slice(0, 10))} by {data.repName}. Valid 30
          days. Roof measurement derived from aerial imagery and subject to
          on-site verification. {profile.legalName}, MSBOC #{profile.license},{" "}
          {profile.street}, {profile.city}, {profile.state} {profile.postal}.
        </p>
      </section>

      {profile.showInsurance && <InsurancePage />}
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
