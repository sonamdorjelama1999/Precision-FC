import { Shield } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Team } from "@/types";

/**
 * Crest + name, used everywhere a match row needs to show one side — the
 * admin match table (twice per row) and the public fixtures page. Pulled out
 * so that pairing stays consistent in one place.
 */
export function TeamLogo({
  team,
  size = 26,
  className,
}: {
  team: Pick<Team, "name" | "logoUrl">;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-card"
        style={{ width: size, height: size }}
      >
        {team.logoUrl ? (
          <Image
            src={team.logoUrl}
            alt=""
            width={size}
            height={size}
            className="object-contain p-0.5"
          />
        ) : (
          <Shield className="size-3.5 text-muted-foreground" />
        )}
      </span>
      <span className="truncate font-medium">{team.name}</span>
    </span>
  );
}
