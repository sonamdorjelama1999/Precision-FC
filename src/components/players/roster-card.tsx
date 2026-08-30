import Image from "next/image";

import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The portrait tile shared by players and staff: photo fills the card, a
 * scrim carries the name and subtitle, and the person's initials sit
 * underneath as the fallback when there is no photo yet.
 *
 * Players add a shirt number (`numberSlot`) and an optional captain badge;
 * staff render the exact same shell without either. Pulled out of
 * PlayerCard and StaffCard, which had drifted into two copies of one tile.
 */
export function RosterCard({
  name,
  photoUrl,
  subtitle,
  footnote,
  badge,
  numberSlot,
}: {
  name: string;
  photoUrl: string | null;
  subtitle: string;
  footnote?: string | null;
  badge?: React.ReactNode;
  numberSlot?: React.ReactNode;
}) {
  return (
    <article className="group pfc-player-ground pfc-card-shadow relative block aspect-3/4 w-full overflow-hidden rounded-card transition-transform duration-200 hover:-translate-y-1 hover:pfc-card-shadow-hover">
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <span
          aria-hidden
          className="mb-[12%] font-display text-[clamp(54px,11vw,78px)] leading-none font-black tracking-[0.01em] text-white/15 select-none"
        >
          {initials(name)}
        </span>
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 216px, (max-width: 1280px) 300px, 350px"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.045]"
          />
        ) : null}
      </div>

      {badge}

      <div
        className={cn(
          "pfc-player-scrim absolute inset-x-0 bottom-0 px-3.5 pt-9 pb-3.5 sm:px-5 sm:pt-12 sm:pb-5 xl:px-6 xl:pt-14 xl:pb-6",
          numberSlot && "flex items-end gap-2.5 sm:gap-3 xl:gap-4",
        )}
      >
        {numberSlot}
        <div>
          <h3 className="text-base leading-tight font-extrabold tracking-[-0.015em] text-white sm:text-[19px] xl:text-[22px]">
            {name}
          </h3>
          <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-teal xl:text-[12px]">
            {subtitle}
          </p>
          {footnote ? (
            <p className="mt-[3px] text-xs text-white/55 xl:text-[13px]">{footnote}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
