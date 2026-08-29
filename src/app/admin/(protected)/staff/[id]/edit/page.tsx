import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaffForm } from "@/components/admin/staff-form";
import { getStaffMemberById } from "@/features/team/queries";

export const metadata: Metadata = { title: "Edit staff member" };

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getStaffMemberById(id);

  if (!member) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Team &middot; {member.role}
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">{member.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Uploading a new photo replaces the old one and deletes it from storage.
        </p>
      </header>

      <StaffForm member={member} />
    </div>
  );
}
