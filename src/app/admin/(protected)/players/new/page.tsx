import type { Metadata } from "next";

import { PlayerForm } from "@/components/admin/player-form";
import { getPrimaryTeam, getTeamOptions } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Add player" };

export default async function NewPlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;

  // Arriving without a team in the URL (the plain "Add player" button, not a
  // team's "Manage players" link) still needs a sensible default — new
  // players belong on the club's own team unless told otherwise.
  const [teams, primaryTeam] = await Promise.all([
    getTeamOptions(),
    teamId ? Promise.resolve(null) : getPrimaryTeam(),
  ]);
  const defaultTeamId = teamId ?? primaryTeam?.id;

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Squad
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Add player</h1>
        <p className="mt-2 text-muted-foreground">
          Goals and assists are not entered here — they come from the match log.
        </p>
      </header>

      <PlayerForm teams={teams} defaultTeamId={defaultTeamId} />
    </div>
  );
}
