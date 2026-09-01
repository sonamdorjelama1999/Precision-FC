import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SponsorTable } from "@/components/admin/team-tables";
import { Button } from "@/components/ui/button";
import { getSponsors } from "@/features/team/queries";

export const metadata: Metadata = { title: "Sponsors" };

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/teams"
            className="mb-2 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark hover:underline"
          >
            ← Teams
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Sponsors</h1>
          <p className="mt-2 text-muted-foreground">
            Shown in the sponsor band on the home and squad pages.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href="/admin/sponsors/new">
            <Plus className="size-4" />
            Add sponsor
          </Link>
        </Button>
      </header>

      <SponsorTable sponsors={sponsors} />
    </div>
  );
}
