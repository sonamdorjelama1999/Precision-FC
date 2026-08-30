import { RosterCard } from "@/components/players/roster-card";
import { POSITION_LABEL, type Player } from "@/types";

/**
 * The player's tile: the shared RosterCard shell plus the two things only a
 * player has — a shirt number and, for one player at a time, a captain badge.
 */
export function PlayerCard({ player }: { player: Player }) {
  return (
    <RosterCard
      name={player.name}
      photoUrl={player.photoUrl}
      subtitle={POSITION_LABEL[player.position]}
      footnote={player.role}
      badge={
        player.isCaptain ? (
          <span className="pointer-events-none absolute top-3 left-3 rounded-[3px] bg-lime px-2 py-[5px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-navy-900">
            Captain
          </span>
        ) : null
      }
      numberSlot={
        <span className="shrink-0 font-display text-[30px] leading-[0.84] font-black tracking-[-0.05em] tabular-nums text-lime sm:text-[38px] xl:text-[46px]">
          {player.playerNumber}
        </span>
      }
    />
  );
}
