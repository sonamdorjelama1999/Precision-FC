import { MatchRow } from "@/components/matches/match-row";
import type { Match } from "@/types";

export function MatchList({
  matches,
  emptyMessage = "No matches to show yet.",
}: {
  matches: Match[];
  emptyMessage?: string;
}) {
  if (matches.length === 0) {
    return <p className="text-ink-2">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} />
      ))}
    </div>
  );
}
