import Image from "next/image";

import { initials } from "@/lib/format";
import type { StaffMember } from "@/types";

/**
 * Same tile as a player, without a shirt number — the manager and coaches sit
 * in the squad grid rather than in a separate list, as they do on a club site.
 */
export function StaffCard({ member }: { member: StaffMember }) {
  return (
    <article className="group pfc-player-ground pfc-card-shadow relative block aspect-3/4 overflow-hidden rounded-card transition-transform duration-200 hover:-translate-y-1 hover:pfc-card-shadow-hover">
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <span
          aria-hidden
          className="mb-[12%] font-display text-[clamp(54px,11vw,78px)] leading-none font-black tracking-[0.01em] text-white/15 select-none"
        >
          {initials(member.name)}
        </span>
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.045]"
          />
        ) : null}
      </div>

      <div className="pfc-player-scrim absolute inset-x-0 bottom-0 px-3.5 pt-9 pb-3.5 sm:px-[18px] sm:pt-11 sm:pb-[18px]">
        <h3 className="text-base leading-tight font-extrabold tracking-[-0.015em] text-white sm:text-[19px]">
          {member.name}
        </h3>
        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-teal">
          {member.role}
        </p>
      </div>
    </article>
  );
}
