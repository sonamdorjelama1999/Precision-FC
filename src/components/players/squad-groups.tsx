import { CardRow } from "@/components/players/card-row";
import { PlayerCard } from "@/components/players/player-card";
import { StaffCard } from "@/components/players/staff-card";
import {
  POSITION_GROUP_LABEL,
  POSITION_GROUP_ORDER,
  type Player,
  type StaffMember,
} from "@/types";

/**
 * The squad, grouped by position under its own heading — the layout a club
 * site uses, read keepers-first and back to front.
 *
 * Each group is ONE row that scrolls sideways, never a wrapping grid. That
 * keeps every card the same fixed size whether a group holds two keepers or
 * eight forwards; a wrapping grid would push the ninth card onto a second row
 * and a fill-the-row grid would resize the cards per group.
 */
const CARD_WIDTH = "w-[220px] shrink-0 snap-start sm:w-[260px] lg:w-[300px] xl:w-[350px]";

export function SquadGroups({
  players,
  staff,
}: {
  players: Player[];
  staff: StaffMember[];
}) {
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
          <CardRow>
            {group.players.map((player) => (
              <div key={player.id} className={CARD_WIDTH}>
                <PlayerCard player={player} />
              </div>
            ))}
          </CardRow>
        </section>
      ))}

      {staff.length > 0 ? (
        <section>
          <GroupHeading label={staff.length === 1 ? "Manager" : "Coaching staff"} />
          <CardRow>
            {staff.map((member) => (
              <div key={member.id} className={CARD_WIDTH}>
                <StaffCard member={member} />
              </div>
            ))}
          </CardRow>
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
