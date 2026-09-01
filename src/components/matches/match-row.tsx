import { TeamLogo } from "@/components/admin/team-logo";
import { formatDate, formatDay, formatTime } from "@/lib/format";
import { FIXTURE_STATUS_LABEL, MATCH_TYPE_LABEL, type Match } from "@/types";

/**
 * One fixture or result row on the public Fixtures page — a Match is a
 * fixture and a result at different points of the same lifecycle (see the
 * model comment in prisma/schema.prisma), so this one row covers both.
 *
 * No expand/collapse here, unlike the old per-goal timeline row: Match has
 * no goal-event log of its own (that stayed on the legacy Fixture model),
 * so there's nothing further to reveal.
 */
export function MatchRow({ match }: { match: Match }) {
  const hasScore =
    match.status === "COMPLETED" && match.homeScore != null && match.awayScore != null;

  const meta = [match.competitionName ?? MATCH_TYPE_LABEL[match.matchType], match.venue]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="overflow-hidden rounded border border-line bg-paper-2">
      <div
        className={[
          "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-2.5 px-5 py-4",
          "[grid-template-areas:'date_score''teams_teams']",
          "md:grid-cols-[128px_minmax(0,1fr)_auto] md:gap-[18px] md:[grid-template-areas:'date_teams_score']",
        ].join(" ")}
      >
        <span className="[grid-area:date] font-mono text-[11px] uppercase leading-[1.5] tracking-[0.1em] text-ink-3">
          <b className="block font-semibold tracking-[0.06em] text-ink">
            {formatDate(match.scheduledAt)}
          </b>
          {hasScore ? formatDay(match.scheduledAt) : `Kick-off ${formatTime(match.scheduledAt)}`}
        </span>

        <span className="[grid-area:teams] flex flex-wrap items-center gap-2.5">
          <TeamLogo team={match.homeTeam} size={24} className="font-display text-[15px]" />
          <span className="text-sm text-ink-3">v</span>
          <TeamLogo team={match.awayTeam} size={24} className="font-display text-[15px]" />
          {meta ? (
            <small className="w-full font-mono text-[10.5px] font-normal uppercase tracking-[0.13em] text-ink-3">
              {meta}
            </small>
          ) : null}
        </span>

        {hasScore ? (
          <span className="[grid-area:score] justify-self-end self-center rounded-[3px] bg-navy-800 px-3.5 py-1.5 font-mono text-[22px] font-semibold tracking-[-0.02em] whitespace-nowrap tabular-nums text-white">
            {match.homeScore} – {match.awayScore}
          </span>
        ) : (
          <span className="[grid-area:score] justify-self-end self-center rounded-[3px] border border-dashed border-line-strong px-3.5 py-[9px] font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
            {FIXTURE_STATUS_LABEL[match.status]}
          </span>
        )}
      </div>
    </article>
  );
}
