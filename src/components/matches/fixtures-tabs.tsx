"use client";

import { useState } from "react";

import { MatchList } from "@/components/matches/match-list";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";

/**
 * The Upcoming/Results toggle. Both lists are fetched once on the server and
 * handed down as props — switching tabs is a pure client-side render swap,
 * no extra request.
 */
export function FixturesTabs({ upcoming, results }: { upcoming: Match[]; results: Match[] }) {
  const [tab, setTab] = useState<"upcoming" | "results">("upcoming");

  return (
    <div>
      <div className="mb-5 flex gap-1 border-b border-line" role="tablist">
        <TabButton active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
          Upcoming ({upcoming.length})
        </TabButton>
        <TabButton active={tab === "results"} onClick={() => setTab("results")}>
          Results ({results.length})
        </TabButton>
      </div>

      {tab === "upcoming" ? (
        <MatchList matches={upcoming} emptyMessage="No upcoming fixtures scheduled yet." />
      ) : (
        <MatchList matches={results} emptyMessage="No results recorded yet." />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.08em] transition-colors",
        active ? "text-ink" : "text-ink-3 hover:text-ink",
        active &&
          "after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-lime-dark",
      )}
    >
      {children}
    </button>
  );
}
