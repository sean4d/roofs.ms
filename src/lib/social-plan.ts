import type { PhaseKey } from "@/config/job-taxonomy";

/**
 * The marketer gate. Between the upload form and the social fan-out, this
 * decides what a post should actually look like, because "post whatever was
 * uploaded, in whatever order" produced a Facebook carousel that opened with
 * five plywood decking shots under the words "another quality roof installed".
 *
 * Owner rules (2026-08-01):
 *   • Finished work leads. The feed thumbnail is the whole ballgame, nobody
 *     sees slide six.
 *   • On a genuine before/after job the BEFORE leads and photos alternate 1:1,
 *     paired by upload order.
 *   • During-install shots cap at ONE and always go last. They are context,
 *     never the pitch.
 *   • Nothing is labelled. No burned-in badges: the caption explains.
 *   • A job with no finished-work photos does not auto-post at all.
 *
 * Single-image surfaces (Google Business Profile, the map pin, the gallery
 * card) get `hero` instead of the carousel: there is no swipe, so a "before"
 * there would be the entire post.
 */

/** Instagram's carousel ceiling; also about where a viewer stops swiping. */
export const CAROUSEL_MAX = 10;

export interface PlannablePhoto {
  phase: PhaseKey;
}

export type PostShape =
  /** Finished work only, or finished work plus one process shot. */
  | "showcase"
  /** Before → after, alternating in pairs. */
  | "reveal"
  /** Not postable as-is, no finished roof to show. */
  | "hold";

export interface SocialPlan<T extends PlannablePhoto = PlannablePhoto> {
  shape: PostShape;
  /** Carousel order for Facebook, Instagram, and the TikTok slideshow. */
  order: T[];
  /** The one photo for single-image surfaces. Always finished work. */
  hero?: T;
  /** Photos deliberately left off the post (they still live on the site). */
  omitted: T[];
  /** Plain-English rationale: shown on the confirm screen. */
  reason: string;
  /** True when this must not auto-post; the website still gets everything. */
  hold: boolean;
}

function byPhase<T extends PlannablePhoto>(photos: T[], phase: PhaseKey): T[] {
  return photos.filter((p) => p.phase === phase);
}

/**
 * Interleave before/after 1:1, paired by upload order, first before with first
 * after, and so on. Leftovers from the longer side follow the paired run.
 */
function pairUp<T extends PlannablePhoto>(befores: T[], afters: T[]): T[] {
  const out: T[] = [];
  const pairs = Math.min(befores.length, afters.length);
  for (let i = 0; i < pairs; i++) out.push(befores[i], afters[i]);
  out.push(...befores.slice(pairs), ...afters.slice(pairs));
  return out;
}

/**
 * Decide the post. `heroIndexInAfters` lets a caller override which finished
 * photo leads (the vision picker, or the owner tapping a different one on the
 * confirm screen); it indexes into the after photos, in upload order.
 */
export function planSocialPost<T extends PlannablePhoto>(
  photos: T[],
  heroIndexInAfters = 0,
): SocialPlan<T> {
  const befores = byPhase(photos, "before");
  const during = byPhase(photos, "progress");
  const afters = byPhase(photos, "after");

  // No finished roof, no post. The site still shows the work; the owner gets
  // told why rather than discovering a plywood carousel after the fact.
  if (afters.length === 0) {
    return {
      shape: "hold",
      order: [],
      omitted: photos,
      hold: true,
      reason:
        during.length > 0 && befores.length === 0
          ? "Only during-install photos, there's no finished roof to show yet."
          : befores.length > 0 && during.length === 0
            ? "Only before photos, nothing finished to pair them with."
            : "No after photos, so there's nothing to lead the post with.",
    };
  }

  const hero = afters[heroIndexInAfters] ?? afters[0];
  const shape: PostShape = befores.length > 0 ? "reveal" : "showcase";

  // Reveal leads with the before (owner's call. The pairing makes it read as
  // a setup, not as our work). Showcase leads with the hero finished shot.
  let order: T[];
  if (shape === "reveal") {
    order = pairUp(befores, afters);
  } else {
    order = [hero, ...afters.filter((p) => p !== hero)];
  }

  // Leave room for the single process shot before trimming to the ceiling.
  const roomForDuring = during.length > 0 ? 1 : 0;
  const limit = CAROUSEL_MAX - roomForDuring;
  if (order.length > limit) {
    order = order.slice(0, limit);
    // Never end a reveal on an orphan "before". It would look like we posted
    // a bad roof and stopped.
    if (shape === "reveal" && order[order.length - 1]?.phase === "before") {
      order = order.slice(0, -1);
    }
  }

  // Exactly one during-install shot, always last. Context, never the pitch.
  const usedDuring = during.slice(0, roomForDuring);
  order = [...order, ...usedDuring];

  const kept = new Set(order);
  const omitted = photos.filter((p) => !kept.has(p));
  const omittedCount = (all: T[], used: T[]) => all.length - used.length;

  // Count what actually ships, not what was uploaded. The carousel ceiling can
  // trim pairs, and the confirm screen has to tell the truth about that.
  const shippedBefore = order.filter((p) => p.phase === "before").length;
  const shippedAfter = order.filter((p) => p.phase === "after").length;
  const pairs = Math.min(shippedBefore, shippedAfter);
  const trimmed = omittedCount(photos, order);

  const reason =
    shape === "reveal"
      ? `Before and after, alternating in pairs (${pairs} pair${pairs === 1 ? "" : "s"})` +
        (usedDuring.length ? ", plus one during-install shot at the end" : "") +
        (trimmed ? `. ${trimmed} more stay on the website.` : ".")
      : `Finished roof first (${shippedAfter} photo${shippedAfter === 1 ? "" : "s"})` +
        (usedDuring.length
          ? ", with one during-install shot at the end for context"
          : "") +
        (trimmed ? `. ${trimmed} more stay on the website.` : ".");

  return { shape, order, hero, omitted, hold: false, reason };
}

/**
 * One line of context for the caption writer, so the words match the pictures.
 * The old caption generator never saw the photos at all, which is how "another
 * quality roof installed" ended up over a stack of decking.
 */
export function captionBrief(plan: SocialPlan): string {
  if (plan.hold) return "No photos are being posted.";
  const during = plan.order.filter((p) => p.phase === "progress").length;
  if (plan.shape === "reveal") {
    return (
      "The post is a before-and-after: the reader swipes between the old roof " +
      "and the finished one" +
      (during ? ", ending on one photo of the work in progress." : ".")
    );
  }
  return (
    "The post shows the finished roof" +
    (during
      ? ", ending on a single photo of the work in progress (e.g. decking or underlayment)."
      : " only, no in-progress photos are included.")
  );
}
