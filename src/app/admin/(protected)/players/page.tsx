import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PlayerTable } from "@/components/admin/player-table";
import { Button } from "@/components/ui/button";
import { getPlayers } from "@/features/players/queries";
import { getTeamById } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Players" };

export default async function AdminPlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId?: string }>;
}) {
  const { teamId } = await searchParams;

  const [players, team] = await Promise.all([
    getPlayers(teamId ? { teamId } : undefined),
    teamId ? getTeamById(teamId) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/teams"
            className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark hover:underline"
          >
            ← Teams
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Players</h1>
          <p className="mt-2 text-muted-foreground">
            {players.length} player{players.length === 1 ? "" : "s"}
            {teamId ? " on this team." : " on the public squad page."}
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href={teamId ? `/admin/players/new?teamId=${teamId}` : "/admin/players/new"}>
            <Plus className="size-4" />
            Add player
          </Link>
        </Button>
      </header>

      {teamId ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm">
            Managing players for <span className="font-semibold">{team?.name ?? "an unknown team"}</span>
          </p>
          <Link href="/admin/players" className="text-sm text-teal-dark hover:underline">
            Clear filter — show all players
          </Link>
        </div>
      ) : null}

      <PlayerTable players={players} />
    </div>
  );
}
