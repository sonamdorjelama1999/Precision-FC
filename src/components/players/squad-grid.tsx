"use client";

import { useMemo, useState } from "react";

import { PlayerCard } from "@/components/players/player-card";
import { cn } from "@/lib/utils";
import { PLAYER_POSITIONS, POSITION_LABEL, type Player } from "@/types";

type Filter = "ALL" | (typeof PLAYER_POSITIONS)[number];

/**
 * TOMBSTONE — not rendered anywhere; safe to delete this file.
 *
 * The filter-chip squad view from before the page was reworked into
 * SquadGroups (position headings, no client-side filter). Kept compiling
 * rather than deleted outright, in case the filter layout is ever wanted
 * back — but SquadGroups is what the live Squad page actually uses.
 *
 * Client component only because of the position filter. The cards themselves
 * are plain markup — no data fetching happens here, the page passes it in.
 */
export function SquadGrid({ players }: { players: Player[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = players.filter((player) => filter === "ALL" || player.position === filter);

  const available = useMemo(
    () => PLAYER_POSITIONS.filter((position) => players.some((p) => p.position === position)),
    [players],
  );

  return (
    <>
      <div className="mb-[22px] flex flex-wrap gap-2" role="group" aria-label="Filter by position">
        <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>
          All
        </FilterButton>
        {available.map((position) => (
          <FilterButton
            key={position}
            active={filter === position}
            onClick={() => setFilter(position)}
          >
            {POSITION_LABEL[position]}
          </FilterButton>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(158px,1fr))] gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(232px,1fr))] sm:gap-5">
        {visible.length === 0 ? (
          <div className="col-span-full rounded border border-line bg-paper-2 p-[22px] text-ink-2">
            No players in this position yet.
          </div>
        ) : (
          visible.map((player) => <PlayerCard key={player.id} player={player} />)
        )}
      </div>
    </>
  );
}

function FilterButton({
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
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-[3px] border px-[15px] py-[9px] font-display text-[12.5px] font-bold uppercase tracking-[0.08em] transition-colors",
        active
          ? "border-navy-800 bg-navy-800 text-white"
          : "border-line-strong bg-paper-2 text-ink-2 hover:border-navy-800 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
