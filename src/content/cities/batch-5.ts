import type { CityContent } from "@/content/cities/types";

/**
 * City batch 5: Bassfield (owner request 2026-10-06).
 *
 * WHY IT SHIPS NOW. Bassfield went into the service area on 2026-10-05 with no
 * page behind it, which published sixteen internal links to a 404 and pointed
 * a legacy redirect into the same hole. The fix that day was to stop linking
 * it. This is the proper fix: the page exists, so the links can come back.
 *
 * ANTI-DOORWAY, and this town makes that easy rather than hard. Bassfield has
 * one of the most specific roofing stories in the whole service area: on Easter
 * Sunday, 12 April 2020, an EF4 tornado touched down just east of town and ran
 * 67 miles to Clarke County, killing eight people and injuring ninety-nine. A
 * second tornado, an EF3, passed just north of Bassfield thirty-five minutes
 * later. Nothing on this page is find-and-replace copy from another city,
 * because none of that happened to another city.
 *
 * EVERY FACT HERE IS CHECKED. County, the two highway distances, both census
 * populations and the tornado's rating, path, width, wind speed and casualty
 * figures were verified against the National Weather Service record and the
 * census via web search on 2026-10-06, not written from memory. The population
 * is stated as the census figure with its year attached, because 192 is small
 * enough that a reader will think it is a typo otherwise.
 *
 * ON CLAIMING LOCAL WORK. We have one completed Bassfield job, a GAF Timberline
 * HDZ roof in Hickory, already uploaded with photographs. The page says that
 * and nothing more. The "recent work" section on the rendered page is driven by
 * the real project feed, so it shows that job and would show nothing if the job
 * were removed.
 *
 * TWO INTERNAL LINKS THAT ARE NOT DECORATION. Sumrall is 14 miles down MS-42
 * and Seminary was on the 2020 tornado's path; both already have city pages, so
 * the nearby-towns block earns its place here instead of listing whatever
 * happens to be geographically close.
 */
export const citiesBatch5: CityContent[] = [
  {
    slug: "bassfield",
    city: "Bassfield",
    county: "Jefferson Davis County",
    driveTime: "About 50 minutes northwest, up MS-42",
    metaTitle: "Roofing Contractor in Bassfield, MS | Southeast Roofing",
    metaDescription:
      "Roof replacement, repair and storm damage inspections in Bassfield and Jefferson Davis County. GAF-certified, CertainTeed ShingleMaster, free inspections with photos.",
    hero: {
      headline: "Roofing in Bassfield, from a crew that drives MS-42",
      subhead:
        "Jefferson Davis County is a 50-minute run from our Hattiesburg office, and we have already put a roof on a Bassfield home. Free inspection, photographs of whatever we find, and an itemized proposal before anything is ordered.",
    },
    intro: {
      title: "A small town that knows what a bad storm costs",
      paragraphs: [
        "Bassfield sits on MS-42 in Jefferson Davis County, 11 miles southeast of Prentiss and 14 miles northwest of Sumrall. The 2020 census counted 192 people, down from 254 in 2010, which makes it one of the smallest places we serve and one where word travels fastest. A roof that leaks in a town this size is discussed at the store, and so is a contractor who does not come back.",
        "Most of the roofs around Bassfield are single-storey homes on open country lots, which changes the work in two practical ways. There is less tree cover than in Hattiesburg, so the shingles take the full sun and the full wind rather than being shaded and littered, and the nearest supply house is a drive, so a crew that turns up short of material loses a day instead of an hour. We load for the job before we leave Hattiesburg.",
        "We have completed one roof in Bassfield so far, a GAF Timberline HDZ system in Hickory, and the photographs of it are on this site. That is the whole of our local work here and we would rather say so plainly than imply a history we do not have. What we bring is a licensed, insured crew that is already comfortable working this far up MS-42.",
      ],
    },
    localAreas: {
      title: "Where we work around Bassfield",
      items: [
        "Bassfield town limits",
        "MS-42 corridor",
        "Jefferson Davis County",
        "Toward Prentiss",
        "Toward Sumrall",
        "Carson",
        "Rural Jeff Davis County roads",
      ],
    },
    stormContext: {
      title: "Easter Sunday, 12 April 2020",
      text: "Bassfield is on the map of Mississippi tornado history for one afternoon. On Easter Sunday 2020 an EF4 tornado touched down just east of town with winds near 190 mph, grew to over two miles wide, and stayed on the ground for 67 miles through Seminary, Soso, Moss and Pachuta before lifting in Clarke County. Eight people were killed and ninety-nine injured. A second tornado, an EF3, passed just north of Bassfield thirty-five minutes later. Nobody here needs the risk explained to them. What we can add is documentation: a free inspection after a storm, photographs of what we actually find on your roof, and a report in the format an adjuster expects, whether the damage turns out to be a claim or just a repair.",
    },
    faqs: [
      {
        question: "Do you really come out to Bassfield for a roof?",
        answer:
          "Yes. It is about 50 minutes from our office on US-98 in Hattiesburg, straight up MS-42, and we have already completed a roof in town. The drive is our logistics problem, not a line on your estimate.",
      },
      {
        question: "Is a free inspection actually free this far out?",
        answer:
          "Yes, and there is no obligation attached to it. You get photographs of what we found and a straight answer about whether you need a replacement, a repair, or nothing yet. Sometimes the honest answer is that the roof has years left, and we would rather tell you that than sell you a roof you do not need.",
      },
      {
        question: "My roof was damaged in a storm. Do you handle the insurance side?",
        answer:
          "We document it properly and we are there for the adjuster meeting, which is where most of the difficulty is. We photograph the damage thoroughly and put it in the format adjusters work from. The decision on the claim is always the insurer's, never ours, and we will not tell you what they are going to do.",
      },
      {
        question: "What roofing systems do you install out here?",
        answer:
          "Asphalt shingle and metal, the same as everywhere else we work. We are a GAF-certified contractor and a CertainTeed ShingleMaster, and we install GAF Timberline HDZ, the CertainTeed Landmark line including Landmark PRO and ClimateFlex, and Owens Corning shingles. The Bassfield roof we have completed is GAF Timberline HDZ in Hickory.",
      },
      {
        question: "How long does a roof replacement take on a house like mine?",
        answer:
          "Most single-storey homes around here are a one-day tear-off and reroof, weather permitting. We leave the site clean and we do not leave a roof open overnight.",
      },
      {
        question: "What warranty do I get?",
        answer:
          "Two separate ones. Southeast Roofing warrants its own workmanship for 10 years. The shingle manufacturer separately warrants the product, and on qualifying systems that can be a limited-lifetime term. We will show you exactly which applies to the roof you are buying before you sign anything.",
      },
    ],
  },
];
