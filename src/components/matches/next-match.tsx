import { CLUB } from "@/data/club";
import { formatDate, formatDay } from "@/lib/format";
import type { ScoredFixture } from "@/types";

export function NextMatch({ fixture }: { fixture: ScoredFixture | null }) {
  return (
    <div className="rounded border border-white/10 border-l-4 border-l-lime bg-navy-800 p-7 text-white">
      <p className="mb-3.5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
        <span className="h-0.5 w-[22px] shrink-0 bg-lime" />
        Next fixture
      </p>

      {fixture ? (
        <>
          <div className="my-3.5 flex flex-wrap items-center gap-[18px]">
            <strong className="font-display text-[clamp(22px,3.2vw,32px)] font-black uppercase tracking-[-0.02em]">
              {CLUB.short} v {fixture.opponent}
            </strong>
            <em className="font-mono text-xs not-italic tracking-[0.18em] text-teal">
              {fixture.competition}
            </em>
          </div>
          <dl className="flex flex-wrap gap-[22px]">
            <Item label="Date" value={`${formatDay(fixture.date)} ${formatDate(fixture.date)}`} />
            {fixture.kickoff ? <Item label="Kick-off" value={fixture.kickoff} /> : null}
            <Item label="Venue" value={fixture.isHome ? CLUB.ground : "Away"} />
          </dl>
        </>
      ) : (
        <>
          <div className="my-3.5">
            <strong className="font-display text-[clamp(22px,3.2vw,32px)] font-black uppercase tracking-[-0.02em]">
              Nothing scheduled
            </strong>
          </div>
          <p className="text-white/70">The next fixture will appear here once it is added.</p>
        </>
      )}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[120px]">
      <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-teal">{label}</dt>
      <dd className="text-[15px] font-semibold">{value}</dd>
    </div>
  );
}
