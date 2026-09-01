import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TeamForm } from "@/components/admin/team-form";
import { getTeamById } from "@/features/teams/queries";

export const metadata: Metadata = { title: "Edit team" };

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Fixtures
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">{team.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Uploading a new logo replaces the old one and deletes it from storage.
        </p>
      </header>

      <TeamForm team={team} />
    </div>
  );
}
