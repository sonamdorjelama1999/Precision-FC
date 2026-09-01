"use client";

import { DeleteDialog, EmptyState, useDeleteFlow } from "@/components/admin/admin-table-kit";
import { TeamCard } from "@/components/admin/team-card";
import { deleteTeam } from "@/features/teams/actions";
import type { Team } from "@/types";

/**
 * The responsive grid on /admin/teams: 4 columns on wide desktop, 3 on
 * smaller desktop, 2 on tablet, 1 on mobile. Delete goes through the same
 * confirm-dialog wiring as the player/staff/sponsor tables.
 */
export function TeamGrid({ teams }: { teams: Team[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deleteTeam);

  if (teams.length === 0) {
    return (
      <EmptyState
        title="No teams yet"
        body="Add Precision FC first and mark it as the primary team, then add opponents as you schedule matches against them."
        href="/admin/teams/new"
        cta="Add Team"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onDelete={setTarget} />
        ))}
      </div>

      <DeleteDialog
        target={target}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirm}
        isPending={isPending}
        noun="team"
        extra="This removes the team association from any of its players — it does not delete the players themselves."
      />
    </>
  );
}
