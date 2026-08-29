import { MatchRow } from "@/components/matches/match-row";
import type { ScoredFixture } from "@/types";

export function MatchList({
  fixtures,
  emptyMessage = "No matches recorded yet.",
}: {
  fixtures: ScoredFixture[];
  emptyMessage?: string;
}) {
  if (fixtures.length === 0) {
    return <p className="text-ink-2">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {fixtures.map((fixture) => (
        <MatchRow key={fixture.id} fixture={fixture} />
      ))}
    </div>
  );
}
