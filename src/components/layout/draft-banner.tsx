import { DRAFT_DATA } from "@/data/club";

/**
 * Carried over from the static site: a loud reminder that the match data is
 * still placeholder. Set DRAFT_DATA to false in src/data/club.ts once the
 * real results are in.
 */
export function DraftBanner() {
  if (!DRAFT_DATA) return null;

  return (
    <div role="note" className="bg-lime px-6 py-2.5 text-center text-[13px] font-semibold text-navy-900">
      <strong>Draft data.</strong> Match dates, scores and goal times are placeholders. Replace them,
      then set <code className="font-mono text-[0.87em]">DRAFT_DATA</code> to false in{" "}
      <code className="font-mono text-[0.87em]">src/data/club.ts</code>.
    </div>
  );
}
