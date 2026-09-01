import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { MatchTable } from "@/components/admin/match-table";
import { Button } from "@/components/ui/button";
import { getMatches } from "@/features/matches/queries";
import { getTeamOptions } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Matches" };

export default async function AdminMatchesPage() {
  const [matches, teams] = await Promise.all([getMatches(), getTeamOptions()]);
  const needsTeams = teams.length < 2;
  const addHref = needsTeams ? "/admin/teams/new" : "/admin/matches/new";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
            Fixtures
          </p>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Matches</h1>
          <p className="mt-2 text-muted-foreground">
            {matches.length} match{matches.length === 1 ? "" : "es"} scheduled.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href={addHref}>
            <Plus className="size-4" />
            {needsTeams ? "Add a team" : "Schedule match"}
          </Link>
        </Button>
      </header>

      {needsTeams ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm">
            You need at least two teams before you can schedule a match — Precision FC and one
            opponent.
          </p>
          <Link href="/admin/teams/new" className="text-sm text-teal-dark hover:underline">
            Add a team
          </Link>
        </div>
      ) : null}

      <MatchTable matches={matches} />
    </div>
  );
}
