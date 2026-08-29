import { siteConfig } from "@/config/site";
import {
  FINANCING,
  MATERIALS,
  materialForCustomer,
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
 *
 * LAYOUT RULE, AND IT MATTERS. This was written as a sheet of paper and then
 * read on a phone, where 8.5 inches of fixed columns became a document wider
 * than the screen: the address ran off the right edge and the pitch sat on top
 * of the storey count. So the base classes here are the PHONE layout, and both
 * `sm:` and `print:` restore the paper one.
 *
 * Both, every time, with the same values. `sm:` alone would be wrong because a
 * rep printing from an iPhone is in print media, and `print:` alone would be
 * wrong on a laptop screen. Giving the pair identical values also means it
 * cannot matter which of them Tailwind emits last.
 */

/**
 * The stored material, narrowed back to a key we recognise.
 *
 * The column is plain text and holds whatever was current when the quote was
 * saved, so a value that has since been renamed or removed must not throw on a
 * document a customer is waiting to read. Architectural is the fallback because
 * it is what the rate card is built on.
 */
function materialKeyOf(stored: string | null): MaterialKey {
  return stored && stored in MATERIALS
    ? (stored as MaterialKey)
    : "architectural";
}

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

  /**
   * More than one roof on the property.
   *
   * 109 Green Timber is the reason: a house and a detached shed in the same
   * yard, quoted as one job. Anything with a single structure prints exactly as
   * it always did, so every estimate written before this existed still reads
   * correctly.
   */
  const parts =
    data.structures && data.structures.length > 1 ? data.structures : null;

  // The material the rep actually chose, named as a customer should read it:
  // through materialForCustomer, which adds the manufacturer and line where the
  // price assumes one. Falling back to architectural keeps older quotes,
  // written before the choice existed, readable. With several structures the
  // materials can differ, so name each distinct one: a customer reading
  // "architectural shingles" on a job that includes a metal shop would be right
  // to think we had not looked.
  const materialLabel = parts
    ? [...new Set(parts.map((p) => materialForCustomer(p.material)))].join(", ")
    : materialForCustomer(materialKeyOf(data.material));

  return (
    <article className="proposal mx-auto w-full max-w-[8.5in] bg-white text-slate-900">
      {/* ---------- masthead ---------- */}
      {/* SAME CONSTRUCTION AS THE MAILER, deliberately. A rep prints one of
          these at a door and the office posts the other, and until now they
          looked like documents from two different companies. Whatever a
          homeowner receives should be recognisably the same firm. */}
      <header className="flex flex-col gap-3 border-b-2 border-[#123b63] px-5 pt-6 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 print:flex-row print:items-center print:justify-between print:gap-6 print:px-8">
        <div className="flex items-center gap-3">
          {profile.logoDataUri ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.logoDataUri}
              alt={profile.legalName}
              className="block h-12 w-auto max-w-[2.3in] shrink-0 object-contain"
            />
          ) : (
            logo && (
              <InlineSvg svg={logo} className="block h-12 w-12 shrink-0" />
            )
          )}
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-[19px] leading-none font-extrabold tracking-tight text-[#123b63]">
              {profile.legalName}
            </p>
            <p className="mt-1 text-[10px] tracking-[0.14em] text-slate-500 uppercase">
              {profile.city}, {profile.state} &middot; MSBOC #{profile.license}
            </p>
          </div>
        </div>
        <div className="text-[10px] leading-[1.6] text-slate-600 sm:text-right print:text-right">
          <span className="font-bold" style={{ color: profile.accentColor }}>
            {profile.phone}
          </span>
          <br />
          {profile.website}
        </div>
      </header>

      {/* ---------- who this is for ---------- */}
      <section className="grid grid-cols-2 gap-4 px-5 pt-5 sm:gap-6 sm:px-8 sm:pt-6 print:gap-6 print:px-8 print:pt-6">
        {/* WHEN THE NAME IS UNKNOWN, THE PROPERTY IS THE PERSONALISATION.
            This printed "Homeowner" where a person's name goes, which reads as
            a mail merge that failed and undoes the one thing this document has
            going for it: that we picked out their actual roof and measured it.
            No name means the address becomes the subject of the sentence. */}
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            {data.name ? "Prepared for" : "Prepared for the property at"}
          </p>
          {data.name && (
            <p className="mt-1 text-[15px] font-semibold">{data.name}</p>
          )}
          <p
            className={`text-[13px] leading-snug text-slate-700 ${data.name ? "" : "mt-1 text-[15px] font-semibold text-slate-900"}`}
          >
            {data.address}
          </p>
        </div>
        <div className="min-w-0 text-right">
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
      {/* THE SAME TREATMENT AS THE MAILER: a white card with navy rules rather
          than a filled navy block. Two reasons. It matches the piece the office
          posts, so a homeowner who gets both is looking at one company. And it
          is a fraction of the ink on a document reps print all day.

          "Estimated roof replacement", not "estimated investment". A price is a
          price, and calling it an investment is the kind of word that makes a
          homeowner trust the rest of the page less. */}
      <section className="mx-5 mt-5 border-y-[3px] border-[#123b63] py-5 sm:mx-8 print:mx-8">
        <p className="text-[11px] font-bold tracking-[0.16em] text-slate-500 uppercase">
          Estimated roof replacement
        </p>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-[40px] leading-none font-extrabold text-[#123b63] sm:text-[52px] print:text-[52px]">
          {firm
            ? money(data.priceShown!)
            : `${money(data.priceLow)} to ${money(data.priceHigh)}`}
        </p>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate-700">
          Approximately <strong>{data.squares} roofing squares</strong>
          {data.stories ? `, ${data.stories} story` : ""}
          {pitchOver12 ? `, ${pitchOver12}:12 pitch` : ""}, {materialLabel}
          {parts ? `, ${parts.length} structures` : ""}.
        </p>

        {profile.showFinancing && (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:flex-row print:items-end print:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
                {profile.financingLine}
              </p>
              <p className="mt-1.5 text-[14px] leading-snug text-slate-800">
                {FINANCING.termsMonths.map((months, i) => (
                  <span key={months}>
                    {i > 0 ? "  ·  " : ""}
                    <strong className="font-[family-name:var(--font-archivo)] text-[18px] font-bold text-[#123b63]">
                      {money(
                        paymentFor(
                          firm ? data.priceShown! : data.priceLow,
                          months,
                        ),
                      )}
                    </strong>
                    <span className="text-slate-600">
                      /mo, {months / 12} yrs
                    </span>
                  </span>
                ))}
              </p>
              <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
                Example payments on{" "}
                {money(firm ? data.priceShown! : data.priceLow)} at{" "}
                {(FINANCING.apr * 100).toFixed(2)}% APR through{" "}
                {FINANCING.partner}, subject to credit approval. Your rate and
                term may differ. Scan the code to open this estimate on your
                phone.
              </p>
            </div>
            {qr && (
              <div className="w-fit shrink-0 self-start rounded border border-slate-300 bg-white p-1.5 sm:self-end print:self-end">
                <InlineSvg svg={qr} className="block h-[74px] w-[74px]" />
              </div>
            )}
          </div>
        )}
      </section>

      {/* ---------- their roof ---------- */}
      <section
        className={`page-one-end mt-6 px-5 sm:mt-7 sm:px-8 print:mt-7 print:px-8 ${parts && parts.length > 3 ? "allow-break" : ""}`}
      >
        <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          {parts ? "Your roofs, measured" : "Your roof, measured"}
        </h2>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:gap-6 print:flex-row print:gap-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:flex-1 md:grid-cols-3 md:self-start print:flex-1 print:grid-cols-3 print:self-start">
            <Fact
              label={parts ? "Total roof area" : "Roof area"}
              value={`${data.squares} squares`}
            />
            <Fact
              label="Pitch"
              value={pitchOver12 ? `${pitchOver12}:12` : "See inspection"}
            />
            <Fact
              label={parts ? "Structures" : "Stories"}
              value={
                parts
                  ? String(parts.length)
                  : data.stories
                    ? `${data.stories}`
                    : String(data.planes)
              }
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aerialSrc}
            alt="Aerial view of the roof"
            className="h-[180px] w-full rounded border border-slate-300 object-cover md:h-[150px] md:w-[150px] md:shrink-0 print:h-[150px] print:w-[150px] print:shrink-0"
          />
        </div>
        {/* One line per building, priced on its own terms. Every figure here
            comes from the server's own arithmetic and the lines add to the
            total exactly, because a customer checks that before anything
            else on the page. */}
        {parts && (
          <div className="-mx-5 mt-4 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0 print:mx-0 print:overflow-visible print:px-0">
            <table className="w-full min-w-[19rem] border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-slate-300 text-left text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
                  <th className="pb-1.5 font-bold">Structure</th>
                  <th className="pb-1.5 text-right font-bold">Squares</th>
                  <th className="pb-1.5 pl-4 font-bold">Roof system</th>
                  <th className="pb-1.5 text-right font-bold">Price</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p, i) => (
                  <tr
                    key={`${p.lat}${p.lon}${i}`}
                    className="border-b border-slate-200"
                  >
                    <td className="py-1.5 font-semibold">{p.label}</td>
                    <td className="py-1.5 text-right tabular-nums">
                      {p.squares.toFixed(1)}
                    </td>
                    <td className="py-1.5 pl-4 text-slate-600">
                      {p.materialLabel}
                      {p.stories === 2 ? ", 2 story" : ""}
                    </td>
                    <td className="py-1.5 text-right tabular-nums">
                      {money(p.price)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-2 font-bold text-[#123b63]">Total</td>
                  <td className="pt-2 text-right font-bold text-[#123b63] tabular-nums">
                    {data.squares}
                  </td>
                  <td />
                  <td className="pt-2 text-right font-bold text-[#123b63] tabular-nums">
                    {money(firm ? data.priceShown! : data.priceLow)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* THE DATE AND THE PICTURE ARE NOT THE SAME SOURCE, and this used to
            say they were. imageryDate belongs to Google's Solar mesh, which is
            what the measurement is taken from; the photograph beside it is a
            Maps Static satellite tile, a different and usually newer dataset.
            Saying "photographed November 2019" under a picture that is not
            from 2019 is a claim a homeowner can disprove by looking. */}
        <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
          {data.imageryDate
            ? `Measured from aerial survey data recorded ${longDate(data.imageryDate.slice(0, 10))}. `
            : "Measured from aerial survey data. "}
          One roofing square is 100 square feet. If the house has been added to
          since, tell us and we will remeasure.
        </p>
      </section>

      {/* ---------- what the price assumes ---------- */}
      <section className="mt-6 px-5 sm:px-8 print:px-8">
        <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          What this price includes, and what it assumes
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1.5 text-[12px] leading-relaxed sm:grid-cols-2 print:grid-cols-2">
          <ul className="space-y-1.5">
            <Line>Tear off the existing roof and haul it away</Line>
            <Line>{materialLabel}, installed to manufacturer spec</Line>
            <Line>Synthetic underlayment, starter strip and ridge cap</Line>
            <Line>New pipe boots, drip edge and valley flashing</Line>
            <Line>Magnetic sweep of the property when we finish</Line>
            <Line>Permits and final inspection</Line>
          </ul>
          <ul className="mt-1.5 space-y-1.5 text-slate-600 sm:mt-0 print:mt-0">
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
        <section className="mt-6 px-5 sm:px-8 print:px-8">
          <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            Weather on record at this address
          </h2>
          <p className="mt-3 text-[12px] leading-relaxed">{storms.sentence}</p>
          {/* Chosen in summarizeStorms rather than sliced here. Picking the
              three nearest meant printing three wind reports on an address
              where hail had fallen, because wind outnumbers hail five to one
              in this territory. */}
          {storms.supporting.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {storms.supporting.map((e) => (
                <li
                  key={`${e.date}${e.label}${e.distanceMi}`}
                  className="text-[11px] text-slate-600"
                >
                  {longDate(e.date)} &middot; {e.label} &middot; {e.distanceMi}{" "}
                  miles away
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
      <section className="mt-6 px-5 sm:px-8 print:px-8">
        <h2 className="border-b border-slate-200 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          Who you would be hiring
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-[12px] sm:grid-cols-2 print:grid-cols-2">
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
      <section className="mt-7 border-t-2 border-[#123b63] px-5 pt-5 pb-8 sm:px-8 print:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 print:flex-row print:items-end print:justify-between print:gap-6">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-archivo)] text-[17px] font-extrabold text-[#123b63]">
              {profile.headline}
            </p>
            <p className="mt-1.5 max-w-[4.6in] text-[12px] leading-relaxed text-slate-700">
              {profile.closingLine}
            </p>
          </div>
          <div className="shrink-0 sm:text-right print:text-right">
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
