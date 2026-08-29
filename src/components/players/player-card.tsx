import Image from "next/image";

import { initials } from "@/lib/format";
import { POSITION_LABEL, type Player, type ScorerRow } from "@/types";

/**
 * The portrait squad tile. Photo fills the card, a scrim carries the shirt
 * number and name, and the player's initials sit underneath as the fallback
 * when there is no photo yet.
 */
export function PlayerCard({ player, stats }: { player: Player; stats: ScorerRow }) {
  return (
    <article className="group pfc-player-ground pfc-card-shadow relative block aspect-3/4 w-full overflow-hidden rounded-card transition-transform duration-200 hover:-translate-y-1 hover:pfc-card-shadow-hover">
      {/* photo layer — the monogram always sits underneath it */}
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <span
          aria-hidden
          className="font-display text-[clamp(54px,11vw,78px)] leading-none font-black tracking-[0.01em] text-white/15 mb-[12%] select-none"
        >
          {initials(player.name)}
        </span>
        {player.photoUrl ? (
          <Image
            src={player.photoUrl}
            alt={player.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 216px, (max-width: 1280px) 300px, 350px"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.045]"
          />
        ) : null}
      </div>

      {/* corner badges */}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        {player.isCaptain ? (
          <span className="rounded-[3px] bg-lime px-2 py-[5px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-navy-900">
            Captain
          </span>
        ) : (
          <span />
        )}
        <span className="flex -translate-y-1 gap-1.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <Chip>{stats.goals} G</Chip>
          <Chip>{stats.assists} A</Chip>
        </span>
      </div>

      {/* name plate */}
      <div className="pfc-player-scrim absolute inset-x-0 bottom-0 flex items-end gap-2.5 px-3.5 pt-9 pb-3.5 sm:gap-3 sm:px-5 sm:pt-12 sm:pb-5 xl:gap-4 xl:px-6 xl:pt-14 xl:pb-6">
        <span className="shrink-0 font-display text-[30px] leading-[0.84] font-black tracking-[-0.05em] tabular-nums text-lime sm:text-[38px] xl:text-[46px]">
          {player.playerNumber}
        </span>
        <div>
          <h3 className="text-base leading-tight font-extrabold tracking-[-0.015em] text-white sm:text-[19px] xl:text-[22px]">
            {player.name}
          </h3>
          <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-teal xl:text-[12px]">
            {POSITION_LABEL[player.position]}
          </p>
          {player.role ? (
            <p className="mt-[3px] text-xs text-white/55 xl:text-[13px]">{player.role}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[3px] bg-navy-900/60 px-2 py-[5px] font-mono text-[9.5px] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
      {children}
    </span>
  );
}
