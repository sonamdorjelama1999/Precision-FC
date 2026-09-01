import "server-only";

import { prisma } from "@/lib/prisma";
import type { Team } from "@/types";

/**
 * The single door to Team data — the football-club entity (Precision FC and
 * its opponents). Distinct from features/team/queries.ts, which is the
 * existing coaching-staff/sponsor domain; see the naming note in
 * prisma/schema.prisma.
 */

export async function getTeams(): Promise<Team[]> {
  const teams = await prisma.team.findMany({
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
    include: { _count: { select: { players: true } } },
  });

  return teams.map(({ _count, ...team }) => ({ ...team, playerCount: _count.players }));
}

export async function getTeamById(id: string): Promise<Team | null> {
  const team = await prisma.team.findUnique({
    where: { id },
    include: { _count: { select: { players: true } } },
  });
  if (!team) return null;

  const { _count, ...rest } = team;
  return { ...rest, playerCount: _count.players };
}

/** The club's own team — auto-selected as the home team when scheduling a match. */
export async function getPrimaryTeam(): Promise<Team | null> {
  return prisma.team.findFirst({ where: { isPrimary: true } });
}

/** Lightweight list for <Select> options — no player count needed there. */
export async function getTeamOptions(): Promise<
  Pick<Team, "id" | "name" | "logoUrl" | "isPrimary">[]
> {
  return prisma.team.findMany({
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
    select: { id: true, name: true, logoUrl: true, isPrimary: true },
  });
}

/** Whether a team is attached to any match — checked before allowing a delete. */
export async function teamHasMatches(id: string): Promise<boolean> {
  const count = await prisma.match.count({
    where: { OR: [{ homeTeamId: id }, { awayTeamId: id }] },
  });
  return count > 0;
}
