import type { Metadata } from "next";

import { PlayerForm } from "@/components/admin/player-form";

export const metadata: Metadata = { title: "Add player" };

export default function NewPlayerPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Squad
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Add player</h1>
        <p className="mt-2 text-muted-foreground">
          Goals and assists are not entered here — they come from the match log.
        </p>
      </header>

      <PlayerForm />
    </div>
  );
}
