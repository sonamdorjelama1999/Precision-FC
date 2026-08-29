"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const router = useRouter();
  const [target, setTarget] = useState<Player | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirmDelete() {
    if (!target) return;
    const player = target;

    startTransition(async () => {
      const result = await deletePlayer(player.id);
      if (result.ok) {
        toast.success(result.message ?? "Player removed.");
        setTarget(null);
        router.refresh();
      } else {
        toast.error(result.message ?? "Could not delete the player.");
      }
    });
  }

  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <p className="mb-1 font-display text-lg font-bold uppercase">No players yet</p>
        <p className="mb-5 text-sm text-muted-foreground">
          Add the first one and it appears on the public squad page straight away.
        </p>
        <Button asChild variant="lime">
          <Link href="/admin/players/new">Add player</Link>
        </Button>
      </div>
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
                      onClick={() => setTarget(player)}
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

      <AlertDialog open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete player?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{target?.name}</strong>? Their photo is
              removed too. This action cannot be undone.
              <span className="mt-2 block">
                Goals they scored stay in the match log — match history is never rewritten.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
