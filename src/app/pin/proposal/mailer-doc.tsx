import { siteConfig } from "@/config/site";
import {
  FINANCING,
  MATERIALS,
  materialForCustomer,
  paymentFor,
} from "@/config/quote-rates";
import type { MaterialKey } from "@/config/quote-rates";
import { getProfile } from "@/lib/quotes/profile";
import { summarizeStorms, longDate } from "@/lib/quotes/storms";
import { nearbyProjects } from "@/lib/quotes/nearby";
import type { ProposalData } from "@/lib/quotes/save";

import { InlineSvg, logoSvg, qrSvg } from "./brand";

/**
 * The version that goes in an envelope, ON SCREEN.
 *
 * THIS IS THE PREVIEW, NOT THE PRINTED DOCUMENT. What comes out of a printer
 * is lib/quotes/mailer-pdf, drawn straight to PDF. The two are the same piece
 * and the same four pages; this one exists so the office can read the estimate
 * before committing paper to it, and so the admin edit link has somewhere to
 * live. Anything that changes in one belongs in the other.
 *
 * The page count is the reason for the split. Held in HTML, it depended on
 * whichever print dialog was open: about 980 CSS pixels of usable page in
 * desktop Chrome, about 700 on iOS Safari, which stamps a header and a footer
 * on every web page it prints. Tuned to one, it split on the other, and the
 * owner kept getting five sheets off his phone. A PDF page cannot be
 * renegotiated by a dialog.
 *
 * A SIBLING OF proposal-doc, NOT A MODE INSIDE IT. The standard document is
 * what a rep shows on a doorstep and emails to somebody they have just spoken
 * to, and it works. Threading a variant flag through every section of it would
 * have put the two audiences in one file where a change for one silently
 * reaches the other. They share the brand mark, the storm data, the profile
 * and the rate card, and nothing else.
 *
 * The estimate itself is identical either way. There is no such thing as a
 * "mailer estimate": this is a rendering of the same quote for a reader who
 * has not met us, reached through the mailer queue the estimate is already in.
 *
 * FOUR PAGES, DECLARED, because the piece is two sheets printed double sided,
 * folded once, into a 6x9 envelope. Sheet one front and back, sheet two front
 * and back. Anything that lands on a fifth page is a sheet that costs postage
 * and arrives half empty.
 *
 * INK IS A REAL COST HERE. Hundreds or thousands of these go through an office
 * printer, so the navy price block that looks good on a screen became a white
 * card with a navy rule. The brand survives in headings, rules and one photo;
 * the paper stays paper. The single darkest element on the whole piece is the
 * response band on page four, which is the one place a reader has to notice.
 */

const NAVY = "#123b63";

export async function MailerDoc({
  data,
  aerialSrc,
}: {
  data: ProposalData;
  aerialSrc: string;
}) {
  const profile = await getProfile();
  const logo = logoSvg();

  // Straight to their own estimate, marked as having come off the paper, so
  // the office can tell a scan from a link somebody was emailed.
  const estimateUrl = data.publicToken
    ? `${siteConfig.url}/estimate/${data.publicToken}?m=1`
    : `${siteConfig.url}/free-inspection`;
  const qr = await qrSvg(estimateUrl);

  const storms = summarizeStorms(data.lat, data.lon);
  const price = data.priceShown ?? data.priceLow;
  const money = (n: number) => `$${n.toLocaleString()}`;
  const pitchOver12 =
    data.pitchDegrees === null
      ? null
      : Math.round(Math.tan((data.pitchDegrees * Math.PI) / 180) * 12 * 10) /
        10;

  const structures = data.structures?.length ?? 1;
  // Named as a customer should read it, manufacturer and line included where
  // the price assumes one. Same helper as the rep's copy, so the two documents
  // cannot disagree about what we said we were installing.
  const materialLabel = data.structures?.length
    ? [
        ...new Set(data.structures.map((p) => materialForCustomer(p.material))),
      ].join(", ")
    : materialForCustomer(
        data.material && data.material in MATERIALS
          ? (data.material as MaterialKey)
          : "architectural",
      );

  const projects = nearbyProjects(data.address);

  // Only the events big enough to be worth a homeowner's attention, and only
  // when there are some. A page of near misses reads as a solicitation.
  const weather = storms.headline?.damaging ? storms : null;

  return (
    <article className="mailer mx-auto w-full max-w-[8.5in] bg-white text-slate-900">
      {/* ================= PAGE 1: the price, and their roof ================= */}
      <section className="mailer-page px-10 pt-8 pb-6">
        <header className="flex items-center justify-between gap-6 border-b-2 border-[#123b63] pb-4">
          <div className="flex items-center gap-3">
            {profile.logoDataUri ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.logoDataUri}
                alt={profile.legalName}
                className="block h-12 w-auto max-w-[2.3in] object-contain"
              />
            ) : (
              logo && <InlineSvg svg={logo} className="block h-12 w-12" />
            )}
            <div>
              <p className="font-[family-name:var(--font-archivo)] text-[19px] leading-none font-extrabold tracking-tight text-[#123b63]">
                {profile.legalName}
              </p>
              <p className="mt-1 text-[10px] tracking-[0.14em] text-slate-500 uppercase">
                {profile.city}, {profile.state} &middot; MSBOC #
                {profile.license}
              </p>
            </div>
          </div>
          <div className="text-right text-[10px] leading-[1.6] text-slate-600">
            <span className="font-bold" style={{ color: NAVY }}>
              {profile.phone}
            </span>
            <br />
            {profile.website}
          </div>
        </header>

        <h1 className="mt-7 font-[family-name:var(--font-archivo)] text-[27px] leading-none font-extrabold tracking-tight text-[#123b63]">
          Roof Replacement Estimate
        </h1>

        {/* The property is the personalisation when there is no name, because
            printing "Homeowner" in the space a name goes reads as a mail merge
            that failed and throws away the one thing this piece has: that we
            picked out their actual roof. */}
        <p className="mt-5 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          {data.name ? "Prepared for" : "Prepared for the property at"}
        </p>
        {data.name && (
          <p className="mt-1 text-[17px] font-bold text-slate-900">
            {data.name}
          </p>
        )}
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-[21px] leading-snug font-bold text-slate-900">
          {data.address}
        </p>
        <p className="mt-1 text-[10px] text-slate-500">
          Estimate #{data.quoteId.slice(0, 8).toUpperCase()} &middot;{" "}
          {longDate(data.createdAt.slice(0, 10))}
        </p>

        {/* The price, as a white card with a navy rule rather than a navy
            block. Same prominence, a fraction of the ink. */}
        <div className="mt-6 border-y-[3px] border-[#123b63] py-6">
          <p className="text-[11px] font-bold tracking-[0.16em] text-slate-500 uppercase">
            Estimated roof replacement
          </p>
          <p className="mt-1 font-[family-name:var(--font-archivo)] text-[58px] leading-none font-extrabold text-[#123b63]">
            {money(price)}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-700">
            Approximately <strong>{data.squares} roofing squares</strong>
            {data.stories ? `, ${data.stories} story` : ""}
            {pitchOver12 ? `, ${pitchOver12}:12 pitch` : ""}, {materialLabel}
            {structures > 1 ? `, ${structures} structures` : ""}.
          </p>
        </div>

        {/*
          THE QUALIFIER SITS NEXT TO THE PRICE, NOT ON PAGE TWO.

          Page two explains at length what the estimate is based on, and page
          two is not where a homeowner is standing when they read the number.
          They see a figure, they form an opinion, and everything after that
          is read against the opinion they already hold. Both directions,
          deliberately: a caveat that only ever warns of increases reads as a
          sales tactic, because it is one.
        */}
        <div className="mt-5 rounded border-l-[3px] border-[#123b63] bg-slate-50 px-4 py-3">
          <p className="text-[12px] leading-relaxed font-bold text-[#123b63]">
            This number came from aerial measurements, not a visit.
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-700">
            It can land a little over or a little under once somebody gets on
            the roof and measures it properly. You will see the final figure in
            writing, and nothing is agreed until you do.
          </p>
        </div>

        {profile.showFinancing && (
          <div className="mt-5">
            <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
              {profile.financingLine}
            </p>
            <p className="mt-1.5 text-[15px] leading-snug text-slate-800">
              {FINANCING.termsMonths.map((months, i) => (
                <span key={months}>
                  {i > 0 ? "  ·  " : ""}
                  <strong className="font-[family-name:var(--font-archivo)] text-[19px] font-bold text-[#123b63]">
                    {money(paymentFor(price, months))}
                  </strong>
                  <span className="text-slate-600">/mo, {months / 12} yrs</span>
                </span>
              ))}
            </p>
            <p className="mt-1 text-[8.5px] leading-relaxed text-slate-500">
              Example payments on {money(price)} at{" "}
              {(FINANCING.apr * 100).toFixed(2)}% APR through{" "}
              {FINANCING.partner}, subject to credit approval. Your rate and
              term may differ.
            </p>
          </div>
        )}

        {/* The recognition moment. A homeowner seeing their own roof from the
            air is the difference between this and a flyer. */}
        <div className="mt-6">
          {/*
            A FRAME THAT CLIPS, AND INLINE SIZES, BECAUSE THE CLASS WAS LOSING.
            The photograph printed at its own natural size, square and enormous,
            straight over the price. Whatever was beating `h-[2.75in]` in the
            print cascade, arguing with it was not working: three attempts fixed
            nothing because none of them could be reproduced headlessly, where
            page.pdf() renders differently from the preview a person prints
            from.

            So the photograph now sits in a box of a fixed height with the
            overflow clipped, and its own dimensions are inline. Inline styles
            are not subject to whatever class generation or cascade problem this
            was, and even if the image still arrives at its natural size it is
            cut off by the frame instead of landing on the price. The failure
            mode goes from "destroys the document" to "photo is cropped", which
            is one somebody can see and I can fix.
          */}
          <div
            className="shot rounded border border-slate-300"
            style={{ height: "2.75in", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aerialSrc}
              alt="Aerial view of the roof measured for this estimate"
              width={640}
              height={264}
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            The roof measured for this estimate.
          </p>
        </div>
      </section>

      {/* ================= PAGE 2: what it is based on ================= */}
      <section className="mailer-page px-10 pt-8 pb-6">
        <SheetHead
          title="What this estimate is based on"
          note="We measured this property from aerial survey data. No appointment was needed."
        />

        <dl className="mt-6 grid grid-cols-2 gap-x-10 gap-y-5">
          <Fact label="Roof area" value={`${data.squares} squares`} />
          <Fact
            label="Stories"
            value={data.stories ? `${data.stories}` : "Not recorded"}
          />
          <Fact
            label="Pitch"
            value={pitchOver12 ? `${pitchOver12}:12` : "Verified on site"}
          />
          <Fact label="Material priced" value={materialLabel} />
          <Fact
            label="Structures measured"
            value={structures === 1 ? "1" : `${structures}`}
          />
          <Fact
            label="Survey data recorded"
            value={
              data.imageryDate
                ? longDate(data.imageryDate.slice(0, 10))
                : "Not recorded"
            }
          />
        </dl>

        {/* HONESTY ABOUT THE DATA'S AGE, because a homeowner who added a room
            knows perfectly well the figure will be short, and a document that
            pretends otherwise loses them. The date is the SURVEY's, not the
            photograph's: those come from two different Google datasets and
            saying the picture was taken then is a claim they can disprove by
            looking at their own house. */}
        {data.imageryDate && (
          <p className="mt-4 rounded border-l-[3px] border-[#123b63] bg-slate-50 px-4 py-3 text-[11.5px] leading-relaxed text-slate-700">
            This is the most recent survey data available for this address
            through our mapping provider. If the house has been extended or
            altered since, the area above will be short, and we correct that in
            person before any contract.
          </p>
        )}

        <h2 className="mt-8 border-b border-slate-300 pb-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
          What is included at this price
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2.5 text-[12px] leading-relaxed">
          {[
            "Tear off the existing roof and haul it away",
            `${materialLabel}, installed to manufacturer spec`,
            "Synthetic underlayment and starter strip",
            "Ridge cap and drip edge",
            "New pipe boots and standard flashing",
            "Ventilation where the existing roof has it",
            "Permits and final inspection",
            "Cleanup and a magnetic nail sweep",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden className="font-bold text-[#123b63]">
                &#10003;
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 border-b border-slate-300 pb-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
          What can change the final price
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2.5 text-[12px] leading-relaxed text-slate-700">
          {[
            "A second layer of shingles underneath",
            "Decking that has rotted and has to be replaced",
            "Structural damage that is not visible from the air",
            "Additions built since the survey data was recorded",
            "Chimneys, skylights or unusual flashing",
            "Upgrades you choose, such as a heavier shingle",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden className="text-slate-400">
                &bull;
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t-2 border-[#123b63] pt-4 text-[12.5px] leading-relaxed">
          <strong className="text-[#123b63]">
            This is an estimate, not a contract price.
          </strong>{" "}
          Before any work is agreed, {profile.legalName} verifies the
          measurements and the condition of the roof in person, and anything
          that changes what you would pay is shown to you in writing first.
        </p>
      </section>

      {/* ================= PAGE 3: who we are, and the weather ============= */}
      <section className="mailer-page px-10 pt-8 pb-6">
        <SheetHead title={`Why ${profile.displayName}`} />

        <ul className="mt-5 grid grid-cols-2 gap-x-10 gap-y-3 text-[12.5px]">
          {profile.credentials.map((c) => (
            <li key={c} className="flex gap-2">
              <span aria-hidden className="font-bold text-[#123b63]">
                &#10003;
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[12.5px] leading-relaxed text-slate-700">
          Based in {profile.city} since {siteConfig.foundingYear}, working
          across the Pine Belt and the Gulf Coast. Our licence and our BBB and
          manufacturer records are public, and you are welcome to check every
          one of them before you call us back.
        </p>

        {/* Only when there genuinely are jobs in their town. City level,
            because the project records carry a city and no coordinates, and
            "1.4 miles away" would be a number we cannot support. */}
        {projects.count > 0 && (
          <>
            <h2 className="mt-8 border-b border-slate-300 pb-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
              Roofs we have completed in {projects.city}
            </h2>
            <p className="mt-4 text-[12.5px] leading-relaxed text-slate-700">
              {projects.count} completed {projects.city}{" "}
              {projects.count === 1 ? "roof is" : "roofs are"} in our public
              gallery, with photographs of the finished work. You can see them
              at {profile.website}/projects.
            </p>
          </>
        )}

        {weather?.sentence && (
          <>
            <h2 className="mt-8 border-b border-slate-300 pb-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
              Severe weather recorded near this property
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed">
              {weather.sentence}
            </p>
            {weather.supporting.length > 0 && (
              <ul className="mt-2.5 space-y-1">
                {weather.supporting.map((e) => (
                  <li
                    key={`${e.date}${e.label}${e.distanceMi}`}
                    className="text-[12px] text-slate-600"
                  >
                    {longDate(e.date)} &middot; {e.label} &middot;{" "}
                    {e.distanceMi} miles away
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
              Source: {weather.source}, {weather.years[0]} to{" "}
              {weather.years[weather.years.length - 1]}.{" "}
              <strong className="text-slate-700">
                Weather reports do not establish that this roof has damage.
              </strong>{" "}
              An inspection is what determines its condition.
            </p>

            <h2 className="mt-8 border-b border-slate-300 pb-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
              If your roof has storm damage
            </h2>
            <ol className="mt-5 space-y-3 text-[12.5px] leading-relaxed">
              {[
                "We inspect the roof and photograph what is actually there.",
                "We explain the conditions we found, including when there is nothing wrong.",
                "You decide whether to contact your insurance company.",
                "We provide the roofing documentation and attend the adjuster's inspection.",
                "Your insurer decides what is covered. That decision is theirs, not ours.",
              ].map((step, i) => (
                <li key={step} className="flex gap-2.5">
                  <span className="mt-[1px] flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border border-[#123b63] text-[9px] font-bold text-[#123b63]">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      {/* ================= PAGE 4: how to answer ================= */}
      <section className="mailer-page flex min-h-0 flex-col px-10 pt-8 pb-6">
        <SheetHead title="Want us to verify this estimate?" />

        <p className="mt-6 text-[15px] leading-relaxed text-slate-800">
          We will inspect the property, measure the roof properly and confirm
          the scope. If the roof has years left in it, we will tell you that
          instead.
        </p>
        <p className="mt-2 font-[family-name:var(--font-archivo)] text-[17px] font-bold text-[#123b63]">
          No cost. No obligation.
        </p>

        {/* The one dark element on the piece, because it is the one place a
            reader has to look. */}
        <div className="mt-7 flex items-center gap-7 rounded bg-[#123b63] px-7 py-6 text-white">
          {qr && (
            <div className="shrink-0 rounded bg-white p-2">
              <InlineSvg svg={qr} className="block h-[1.7in] w-[1.7in]" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-archivo)] text-[23px] leading-tight font-extrabold">
              Verify my estimate
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-white/80">
              Scan the code with your phone camera to open this estimate,
              including the measurements and the photograph of your roof.
            </p>
            <p className="mt-4 font-[family-name:var(--font-archivo)] text-[29px] leading-none font-extrabold">
              {profile.phone}
            </p>
            <p className="mt-1.5 text-[12px] text-white/80">
              Call us. {profile.website}
            </p>
          </div>
        </div>

        {/* WHAT ACTUALLY HAPPENS NEXT. The page was mostly white below the
            response band, and a blank third of a sheet reads as a document
            somebody abandoned. This is the question a homeowner holding an
            unexpected estimate is really asking: what am I agreeing to by
            calling. Answering it plainly is worth more than the white space. */}
        <h2 className="mt-8 border-b border-slate-300 pb-2 text-[11px] font-bold tracking-[0.14em] text-slate-600 uppercase">
          What happens when you call
        </h2>
        <ol className="mt-5 space-y-3.5 text-[12.5px] leading-relaxed">
          {[
            "We agree a time. Most inspections take under an hour and you do not need to be home for the roof itself.",
            "We go up, photograph the whole roof, and measure it properly rather than from the air.",
            "You get the photographs and a firm price, in writing. If the roof does not need replacing, we say so.",
            "Nothing is agreed until you sign something. There is no deposit to book an inspection.",
          ].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="mt-[1px] flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border border-[#123b63] text-[10px] font-bold text-[#123b63]">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <p className="mt-7 text-[12.5px] leading-relaxed text-slate-700">
          Mention estimate{" "}
          <strong className="text-[#123b63]">
            #{data.quoteId.slice(0, 8).toUpperCase()}
          </strong>{" "}
          when you call and whoever answers will have this property and these
          measurements in front of them.
        </p>

        <div className="mt-auto border-t border-slate-300 pt-3 text-[9px] leading-relaxed text-slate-500">
          {profile.legalName}, MSBOC #{profile.license}. {profile.street},{" "}
          {profile.city}, {profile.state} {profile.postal}. {profile.phone}.{" "}
          {profile.email}. Estimate #{data.quoteId.slice(0, 8).toUpperCase()}{" "}
          prepared {longDate(data.createdAt.slice(0, 10))} by {data.repName},
          valid 30 days. Roof area derived from aerial survey data and subject
          to on-site verification. This is an estimate, not a contract.
        </div>
      </section>
    </article>
  );
}

function SheetHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="border-b-2 border-[#123b63] pb-2.5">
      <h2 className="font-[family-name:var(--font-archivo)] text-[21px] leading-tight font-extrabold tracking-tight text-[#123b63]">
        {title}
      </h2>
      {note && (
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
          {note}
        </p>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-[family-name:var(--font-archivo)] text-[19px] leading-tight font-bold text-[#123b63]">
        {value}
      </dd>
    </div>
  );
}
