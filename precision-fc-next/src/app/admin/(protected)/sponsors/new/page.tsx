import type { Metadata } from "next";

import { SponsorForm } from "@/components/admin/sponsor-form";

export const metadata: Metadata = { title: "Add sponsor" };

export default function NewSponsorPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">Team</p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Add sponsor</h1>
        <p className="mt-2 text-muted-foreground">
          Principal partners render larger than partners and supporters.
        </p>
      </header>

      <SponsorForm />
    </div>
  );
}
