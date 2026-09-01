import type { Metadata } from "next";

import { MatchForm } from "@/components/admin/match-form";
import { getPrimaryTeam, getTeamOptions } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Schedule match" };

export default async function NewMatchPage() {
  const [teams, primaryTeam] = await Promise.all([getTeamOptions(), getPrimaryTeam()]);

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Fixtures
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Schedule match</h1>
        <p className="mt-2 text-muted-foreground">
          {primaryTeam
            ? `${primaryTeam.name} is preselected as the home team.`
            : "Mark a team as primary under Team Management to have it preselected here."}
        </p>
      </header>

      <MatchForm teams={teams} primaryTeamId={primaryTeam?.id} />
    </div>
  );
}
