"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteDialog, EmptyState, useDeleteFlow } from "@/components/admin/admin-table-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deletePlayer } from "@/features/players/actions";
import { formatShortDate, initials } from "@/lib/format";
import { POSITION_LABEL, type Player } from "@/types";

export function PlayerTable({ players }: { players: Player[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deletePlayer);

  if (players.length === 0) {
    return (
      <EmptyState
        title="No players yet"
        body="Add the first one and it appears on the public squad page straight away."
        href="/admin/players/new"
        cta="Add player"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Photo</TableHead>
              <TableHead className="w-20">Player #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="pfc-player-ground relative grid size-11 place-items-center overflow-hidden rounded-md">
                    {player.photoUrl ? (
                      <Image
                        src={player.photoUrl}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="font-display text-xs font-black text-white/50">
                        {initials(player.name)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono tabular-nums">{player.playerNumber}</TableCell>
                <TableCell>
                  <span className="font-medium">{player.name}</span>
                  {player.isCaptain ? (
                    <Badge variant="lime" className="ml-2">
                      Captain
                    </Badge>
                  ) : null}
                  {player.role ? (
                    <span className="block text-xs text-muted-foreground">{player.role}</span>
                  ) : null}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {POSITION_LABEL[player.position]}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {formatShortDate(player.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${player.name}`}>
                      <Link href={`/admin/players/${player.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${player.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setTarget({ id: player.id, name: player.name })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        target={target}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirm}
        isPending={isPending}
        noun="player"
        extra="Goals they scored stay in the match log — match history is never rewritten."
      />
    </>
  );
}
