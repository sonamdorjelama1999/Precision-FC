import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { TeamGrid } from "@/components/admin/team-grid";
import { Button } from "@/components/ui/button";
import { getTeams } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Teams" };

export default async function AdminTeamsPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
            Fixtures
          </p>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Team Management</h1>
          <p className="mt-2 text-muted-foreground">
            Create teams, manage team information and organize players.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href="/admin/teams/new">
            <Plus className="size-4" />
            Add Team
          </Link>
        </Button>
      </header>

      <TeamGrid teams={teams} />
    </div>
  );
}
