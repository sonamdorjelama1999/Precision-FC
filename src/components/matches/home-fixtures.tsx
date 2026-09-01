import { MapPin, Shield } from "lucide-react";
import Image from "next/image";

import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FIXTURE_STATUS_LABEL, type FixtureStatus, type Match, type Team } from "@/types";

/**
 * The home page's fixture teaser: a dark "Upcoming / Past" pair of groups,
 * each a short stack of match cards — deliberately its own dark section
 * rather than a card dropped on the light page background, per the
 * reference design. The public /fixtures page keeps its existing light
 * MatchRow list and tab toggle; this is a distinct, simpler teaser aimed at
 * being glanceable from the home page rather than exhaustive.
 */
export function HomeFixtures({ upcoming, past }: { upcoming: Match[]; past: Match[] }) {
  if (upcoming.length === 0 && past.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-white/50">
        No fixtures scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 ? <FixtureGroup label="Upcoming" matches={upcoming} /> : null}
      {past.length > 0 ? <FixtureGroup label="Past" matches={past} /> : null}
    </div>
  );
}

function FixtureGroup({ label, matches }: { label: string; matches: Match[] }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
        {label} ({matches.length})
      </p>
      <div className="mb-4 h-0.5 w-16 bg-lime" aria-hidden />
      <div className="space-y-3">
        {matches.map((match) => (
          <FixtureCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}

function FixtureCard({ match }: { match: Match }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <StatusPill status={match.status} />
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/50">
          {formatDate(match.scheduledAt)} · {formatTime(match.scheduledAt)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <TeamBadge team={match.homeTeam} />
        <span className="shrink-0 font-display text-xs font-bold text-white/30">VS</span>
        <TeamBadge team={match.awayTeam} reverse />
      </div>

      {match.venue ? (
        <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-white/45">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </div>
      ) : null}
    </div>
  );
}

function TeamBadge({
  team,
  reverse = false,
}: {
  team: Pick<Team, "name" | "logoUrl">;
  reverse?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", reverse && "flex-row-reverse")}>
      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5">
        {team.logoUrl ? (
          <Image src={team.logoUrl} alt="" width={36} height={36} className="object-contain p-1" />
        ) : (
          <Shield className="size-4 text-white/40" />
        )}
      </span>
      <span
        className={cn(
          "truncate font-display text-[13px] font-bold tracking-[0.01em] text-white sm:text-sm",
          reverse ? "text-right uppercase" : "",
        )}
      >
        {team.name}
      </span>
    </div>
  );
}

const PILL_STYLE: Record<FixtureStatus, string> = {
  SCHEDULED: "bg-white/10 text-white/60",
  LIVE: "bg-amber-400/15 text-amber-300",
  COMPLETED: "bg-white/10 text-white/60",
  POSTPONED: "bg-red-400/15 text-red-300",
  CANCELLED: "bg-red-400/15 text-red-300",
};

function StatusPill({ status }: { status: FixtureStatus }) {
  const label = status === "COMPLETED" ? "Finished" : FIXTURE_STATUS_LABEL[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]",
        PILL_STYLE[status],
      )}
    >
      {status === "LIVE" ? <span className="size-1.5 rounded-full bg-amber-400" aria-hidden /> : null}
      {label}
    </span>
  );
}
