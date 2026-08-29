import { PlayerCard } from "@/components/players/player-card";
import { StaffCard } from "@/components/players/staff-card";
import {
  POSITION_GROUP_LABEL,
  POSITION_GROUP_ORDER,
  type Player,
  type ScorerRow,
  type StaffMember,
} from "@/types";

/**
 * The squad, grouped by position under its own heading — the layout a club
 * site uses, read keepers-first and back to front.
 *
 * A server component: no filtering state to hold, because the headings do
 * the job the old filter chips did, and the whole page stays static.
 */
export function SquadGroups({
  players,
  scorers,
  staff,
}: {
  players: Player[];
  scorers: ScorerRow[];
  staff: StaffMember[];
}) {
  const statsByName = new Map(scorers.map((row) => [row.name, row]));

  const groups = POSITION_GROUP_ORDER.map((position) => ({
    position,
    label: POSITION_GROUP_LABEL[position],
    players: players.filter((player) => player.position === position),
  })).filter((group) => group.players.length > 0);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.position}>
          <GroupHeading label={group.label} count={group.players.length} />
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {group.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                stats={
                  statsByName.get(player.name) ?? { name: player.name, goals: 0, assists: 0 }
                }
              />
            ))}
          </div>
        </section>
      ))}

      {staff.length > 0 ? (
        <section>
          <GroupHeading label={staff.length === 1 ? "Manager" : "Coaching staff"} />
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {staff.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function GroupHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-5 flex items-baseline gap-3 border-b border-line pb-3">
      <h2 className="text-[clamp(20px,2.6vw,26px)] font-black uppercase tracking-[-0.02em]">
        {label}
      </h2>
      {count !== undefined ? (
        <span className="font-mono text-[11px] tracking-[0.14em] text-ink-3">
          {String(count).padStart(2, "0")}
        </span>
      ) : null}
    </div>
  );
}
