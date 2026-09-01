"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { DeleteDialog, EmptyState, useDeleteFlow } from "@/components/admin/admin-table-kit";
import { MatchStatusBadge } from "@/components/admin/match-status-badge";
import { TeamLogo } from "@/components/admin/team-logo";
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
import { deleteMatch } from "@/features/matches/actions";
import { formatDate, formatTime } from "@/lib/format";
import { MATCH_TYPE_LABEL, type Match } from "@/types";

export function MatchTable({ matches }: { matches: Match[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deleteMatch);

  if (matches.length === 0) {
    return (
      <EmptyState
        title="No matches yet"
        body="Schedule the first fixture — Precision FC is preselected as the home team."
        href="/admin/matches/new"
        cta="Schedule match"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Home</TableHead>
              <TableHead>Away</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Score</TableHead>
              <TableHead className="hidden lg:table-cell">Published</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <TeamLogo team={match.homeTeam} />
                </TableCell>
                <TableCell>
                  <TeamLogo team={match.awayTeam} />
                </TableCell>
                <TableCell className="whitespace-nowrap font-mono text-xs">
                  {formatDate(match.scheduledAt)}
                  <span className="block text-muted-foreground">{formatTime(match.scheduledAt)}</span>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {MATCH_TYPE_LABEL[match.matchType]}
                </TableCell>
                <TableCell>
                  <MatchStatusBadge status={match.status} />
                </TableCell>
                <TableCell className="hidden font-mono tabular-nums md:table-cell">
                  {match.homeScore != null && match.awayScore != null
                    ? `${match.homeScore} – ${match.awayScore}`
                    : "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {match.isPublished ? (
                    <Badge variant="lime">Published</Badge>
                  ) : (
                    <Badge variant="outline">Hidden</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${match.homeTeam.name} vs ${match.awayTeam.name}`}
                    >
                      <Link href={`/admin/matches/${match.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${match.homeTeam.name} vs ${match.awayTeam.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setTarget({
                          id: match.id,
                          name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                        })
                      }
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
        noun="match"
        hasImage={false}
      />
    </>
  );
}
