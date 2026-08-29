import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StaffTable } from "@/components/admin/team-tables";
import { Button } from "@/components/ui/button";
import { getStaff } from "@/features/team/queries";

export const metadata: Metadata = { title: "Staff" };

export default async function AdminStaffPage() {
  const staff = await getStaff();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">Team</p>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Coaching staff</h1>
          <p className="mt-2 text-muted-foreground">
            Shown alongside the squad on the public site, ordered by display order.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href="/admin/staff/new">
            <Plus className="size-4" />
            Add staff member
          </Link>
        </Button>
      </header>

      <StaffTable staff={staff} />
    </div>
  );
}
