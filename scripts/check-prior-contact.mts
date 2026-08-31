import { classifyNear, streetKey } from "@/lib/quotes/delivery";

/**
 * Walk a Gulfport block through the "has this house already heard from us"
 * rule.
 *
 * THIS IS THE CHECK THAT WAS MISSING. The rule was a box of about 45 metres in
 * every direction from the tap, which reads as tight until you put real lot
 * widths through it: on a 65 foot frontage that box holds two houses either
 * side, the ones across the street and the ones backing on to the yard. Patrick
 * and Aaron hit it on their first morning canvassing Gulfport together, and the
 * map told one of them that houses nobody had ever opened had already been
 * contacted.
 *
 * Nothing in the code looked wrong. It needed real coordinates a real distance
 * apart on a real street, which is what this is.
 */

/* A block of Chapman Road, Gulfport. 65 foot frontages, 115 foot lots, and a
   street about 60 feet wide, which is an ordinary Gulf Coast subdivision. */
const BLOCK_LAT = 30.41;
const BLOCK_LON = -89.07;
const FT_PER_DEG_LAT = 364000;
const FT_PER_DEG_LON = 364000 * Math.cos((BLOCK_LAT * Math.PI) / 180);

const east = (feet: number) => BLOCK_LON + feet / FT_PER_DEG_LON;
const north = (feet: number) => BLOCK_LAT + feet / FT_PER_DEG_LAT;

/** House n doors east of number 100, which Aaron has already worked. */
const houseAt = (doors: number) => ({
  address: `${100 + doors * 2} Chapman Rd, Gulfport, MS 39503, USA`,
  lat: BLOCK_LAT,
  lon: east(doors * 65),
});

interface Case {
  name: string;
  /** Where the rep tapped. */
  lat: number;
  lon: number;
  address: string | null;
  rows: Array<{ address: string; lat: number; lon: number }>;
  /** null = no notice at all. */
  expect: { address: string; sameProperty: boolean } | null;
}

const AARON = houseAt(0); // 100 Chapman Rd

const cases: Case[] = [
  {
    name: "the same roof, tapped a second time twenty feet off",
    lat: north(20),
    lon: east(10),
    address: AARON.address,
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: true },
  },
  {
    name: "the same roof, one rep on the garage and one on the far gable",
    lat: BLOCK_LAT,
    lon: east(55),
    // Google gave both taps the same street address, which is what settles it.
    address: AARON.address,
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: true },
  },
  {
    name: "next door, 65 ft away, the case the reps actually hit",
    lat: BLOCK_LAT,
    lon: east(65),
    address: houseAt(1).address,
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: false },
  },
  {
    name: "three doors down, 195 ft away",
    lat: BLOCK_LAT,
    lon: east(195),
    address: houseAt(3).address,
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: false },
  },
  {
    name: "across the street, backing on to the same yard",
    lat: north(-170),
    lon: BLOCK_LON,
    address: "101 Delmas Ave, Gulfport, MS 39503, USA",
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: false },
  },
  {
    name: "five doors down, past the end of the notice",
    lat: BLOCK_LAT,
    lon: east(325),
    address: houseAt(5).address,
    rows: [AARON],
    expect: null,
  },
  {
    name: "the same house, one address written Loop and the other Lp",
    lat: north(15),
    lon: east(15),
    address: "109 Green Timber Loop, Purvis, MS 39475, USA",
    rows: [
      {
        address: "109 Green Timber Lp, Purvis, MS 39475, USA",
        lat: BLOCK_LAT,
        lon: BLOCK_LON,
      },
    ],
    expect: {
      address: "109 Green Timber Lp, Purvis, MS 39475, USA",
      sameProperty: true,
    },
  },
  {
    name: "the same house takes priority over a nearer neighbour",
    lat: BLOCK_LAT,
    lon: east(60),
    address: AARON.address,
    // The neighbour's pin is closer to this tap than Aaron's own pin is.
    rows: [{ ...houseAt(1), address: houseAt(1).address }, AARON],
    expect: { address: AARON.address, sameProperty: true },
  },
  {
    name: "no address on the tap, same roof, falls back to distance",
    lat: north(25),
    lon: east(20),
    address: null,
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: true },
  },
  {
    name: "no address on the tap, three doors down, still a neighbour",
    lat: BLOCK_LAT,
    lon: east(195),
    address: null,
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: false },
  },
  {
    name: "a town-level address identifies nothing and falls back to distance",
    lat: BLOCK_LAT,
    lon: east(195),
    address: "Gulfport, MS 39503, USA",
    rows: [AARON],
    expect: { address: AARON.address, sameProperty: false },
  },
];

let failed = 0;
for (const c of cases) {
  const got = classifyNear(c.lat, c.lon, c.address, c.rows);
  const ok = c.expect
    ? !!got &&
      got.row.address === c.expect.address &&
      got.sameProperty === c.expect.sameProperty
    : got === null;
  if (!ok) failed++;

  const describe = got
    ? `${got.sameProperty ? "SAME HOUSE" : "neighbour"} ${got.row.address.split(",")[0]} at ${Math.round(got.feet)} ft`
    : "no notice";
  const want = c.expect
    ? `${c.expect.sameProperty ? "SAME HOUSE" : "neighbour"} ${c.expect.address.split(",")[0]}`
    : "no notice";
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}`);
  console.log(`      got  ${describe}`);
  if (!ok) console.log(`      want ${want}`);
}

/* The normaliser on its own, because it is what decides most real taps. */
const keys: Array<[string | null, string | null]> = [
  ["154 Peres Rd, Carriere, MS 39426, USA", "154 peres rd"],
  ["154 Peres Road, Carriere, MS 39426, USA", "154 peres rd"],
  [
    "18742 Old Columbia Purvis Road Northwest, Lumberton, MS",
    "18742 old columbia purvis rd nw",
  ],
  ["Gulfport, MS 39503, USA", null],
  ["Chapman Rd, Gulfport, MS", null],
  [null, null],
];
for (const [input, want] of keys) {
  const got = streetKey(input);
  const ok = got === want;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  streetKey(${JSON.stringify(input)}) -> ${JSON.stringify(got)}`,
  );
  if (!ok) console.log(`      want ${JSON.stringify(want)}`);
}

console.log(failed ? `\n${failed} failed` : "\nall passed");
process.exit(failed ? 1 : 0);
