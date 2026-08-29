import type { Metadata } from "next";

import { StaffForm } from "@/components/admin/staff-form";

export const metadata: Metadata = { title: "Add staff member" };

export default function NewStaffPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">Team</p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Add staff member</h1>
        <p className="mt-2 text-muted-foreground">
          The manager, a coach, or anyone else shown with the squad.
        </p>
      </header>

      <StaffForm />
    </div>
  );
}
