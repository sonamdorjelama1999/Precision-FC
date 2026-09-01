import type { Metadata } from "next";

import { TeamForm } from "@/components/admin/team-form";

export const metadata: Metadata = { title: "Add team" };

export default function NewTeamPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Fixtures
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Add team</h1>
        <p className="mt-2 text-muted-foreground">
          Add Precision FC as the primary team, or an opponent to schedule matches against.
        </p>
      </header>

      <TeamForm />
    </div>
  );
}
