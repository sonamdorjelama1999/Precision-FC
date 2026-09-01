import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MatchForm } from "@/components/admin/match-form";
import { getMatchById } from "@/features/matches/queries";
import { getTeamOptions } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Edit match" };

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [match, teams] = await Promise.all([getMatchById(id), getTeamOptions()]);

  if (!match) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Fixtures
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Set the status to Completed to enter the final score.
        </p>
      </header>

      <MatchForm match={match} teams={teams} />
    </div>
  );
}
