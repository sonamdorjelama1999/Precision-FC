import { Pencil, Shield, Trash2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Team } from "@/types";

/** One team tile in the /admin/teams grid. */
export function TeamCard({
  team,
  onDelete,
}: {
  team: Team;
  onDelete: (target: { id: string; name: string }) => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-4 border-b border-border p-5">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-background p-2">
          {team.logoUrl ? (
            <Image
              src={team.logoUrl}
              alt=""
              width={56}
              height={56}
              className="max-h-12 w-auto object-contain"
            />
          ) : (
            <Shield className="size-7 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold uppercase tracking-[-0.01em]">
            {team.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-3.5" />
            {team.playerCount ?? 0} player{team.playerCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {team.isPrimary ? (
        <div className="border-b border-border px-5 py-2.5">
          <Badge variant="lime">Primary team</Badge>
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 p-5">
        <Button asChild variant="outline" size="sm" className="min-w-[128px] flex-1">
          <Link href={`/admin/players?teamId=${team.id}`}>Manage players</Link>
        </Button>
        {/* Staff and sponsors are club-wide, not per-opponent, so these only
            make sense on the primary team — that's "our" team. */}
        {team.isPrimary ? (
          <>
            <Button asChild variant="outline" size="sm" className="min-w-[128px] flex-1">
              <Link href="/admin/staff">Manage staff</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="min-w-[128px] flex-1">
              <Link href="/admin/sponsors">Manage sponsors</Link>
            </Button>
          </>
        ) : null}
        <Button asChild variant="ghost" size="icon" aria-label={`Edit ${team.name}`}>
          <Link href={`/admin/teams/${team.id}/edit`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${team.name}`}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete({ id: team.id, name: team.name })}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  );
}
