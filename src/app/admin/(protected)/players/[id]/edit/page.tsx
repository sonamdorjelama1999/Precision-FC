import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlayerForm } from "@/components/admin/player-form";
import { getPlayerById } from "@/features/players/queries";
import { getTeamOptions } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Edit player" };

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [player, teams] = await Promise.all([getPlayerById(id), getTeamOptions()]);

  if (!player) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Squad &middot; #{player.playerNumber}
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">{player.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Uploading a new photo replaces the old one and deletes it from storage.
        </p>
      </header>

      <PlayerForm player={player} teams={teams} />
    </div>
  );
}
