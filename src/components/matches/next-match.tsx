import { TeamLogo } from "@/components/admin/team-logo";
import { formatDate, formatDay, formatTime } from "@/lib/format";
import { MATCH_TYPE_LABEL, type Match } from "@/types";

/**
 * The hero of the public Fixtures page: the soonest published, not-yet-played
 * match. Rebuilt against the real Team/Match model — the previous version
 * read the legacy free-text-opponent Fixture model, which is no longer shown
 * on the public site (see the comment on Fixture in prisma/schema.prisma).
 */
export function NextMatch({ match }: { match: Match | null }) {
  return (
    <div className="rounded border border-white/10 border-l-4 border-l-lime bg-navy-800 p-7 text-white">
      <p className="mb-3.5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
        <span className="h-0.5 w-[22px] shrink-0 bg-lime" />
        Next fixture
      </p>

      {match ? (
        <>
          <div className="my-3.5 flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 font-display text-[clamp(18px,2.4vw,26px)] font-black uppercase tracking-[-0.02em]">
              <TeamLogo team={match.homeTeam} size={34} />
              <span className="text-white/40">v</span>
              <TeamLogo team={match.awayTeam} size={34} />
            </div>
            <em className="font-mono text-xs not-italic tracking-[0.18em] text-teal">
              {match.competitionName ?? MATCH_TYPE_LABEL[match.matchType]}
            </em>
          </div>
          <dl className="flex flex-wrap gap-[22px]">
            <Item
              label="Date"
              value={`${formatDay(match.scheduledAt)} ${formatDate(match.scheduledAt)}`}
            />
            <Item label="Kick-off" value={formatTime(match.scheduledAt)} />
            {match.venue ? <Item label="Venue" value={match.venue} /> : null}
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
