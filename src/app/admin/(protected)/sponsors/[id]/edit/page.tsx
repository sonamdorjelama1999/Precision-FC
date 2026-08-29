import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SponsorForm } from "@/components/admin/sponsor-form";
import { getSponsorById } from "@/features/team/queries";
import { SPONSOR_TIER_LABEL } from "@/types";

export const metadata: Metadata = { title: "Edit sponsor" };

export default async function EditSponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sponsor = await getSponsorById(id);

  if (!sponsor) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Team &middot; {SPONSOR_TIER_LABEL[sponsor.tier]}
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">{sponsor.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Uploading a new logo replaces the old one and deletes it from storage.
        </p>
      </header>

      <SponsorForm sponsor={sponsor} />
    </div>
  );
}
