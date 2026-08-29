import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PlayerTable } from "@/components/admin/player-table";
import { Button } from "@/components/ui/button";
import { getPlayers } from "@/features/players/queries";

export const metadata: Metadata = { title: "Players" };

export default async function AdminPlayersPage() {
  const players = await getPlayers();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
            Squad
          </p>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Players</h1>
          <p className="mt-2 text-muted-foreground">
            {players.length} player{players.length === 1 ? "" : "s"} on the public squad page.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href="/admin/players/new">
            <Plus className="size-4" />
            Add player
          </Link>
        </Button>
      </header>

      <PlayerTable players={players} />
    </div>
  );
}
