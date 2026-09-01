import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { FixtureStatus, Match } from "@/types";

/**
 * The single door to Match data. A "fixture" and a "result" are the same
 * database row at different points of its status lifecycle (see the model
 * comment in prisma/schema.prisma) — admin listing, and later the public
 * Next Match card and Upcoming/Results tabs, all read from here.
 */

const UPCOMING_STATUSES: FixtureStatus[] = ["SCHEDULED", "LIVE", "POSTPONED"];

export interface AdminMatchFilters {
  teamId?: string;
  status?: FixtureStatus;
}

function conditionsFrom(filters?: AdminMatchFilters): Prisma.MatchWhereInput[] {
  const conditions: Prisma.MatchWhereInput[] = [];
  if (!filters) return conditions;

  // Built as a list combined with AND, rather than adding keys onto one
  // object, so a team filter and a status filter can both be active without
  // one OR clause overwriting the other.
  if (filters.teamId) {
    conditions.push({ OR: [{ homeTeamId: filters.teamId }, { awayTeamId: filters.teamId }] });
  }
  if (filters.status) {
    conditions.push({ status: filters.status });
  }
  return conditions;
}

export async function getMatches(filters?: AdminMatchFilters): Promise<Match[]> {
  const conditions = conditionsFrom(filters);
  return prisma.match.findMany({
    where: conditions.length > 0 ? { AND: conditions } : undefined,
    orderBy: { scheduledAt: "asc" },
    include: { homeTeam: true, awayTeam: true },
  });
}

export async function getMatchById(id: string): Promise<Match | null> {
  return prisma.match.findUnique({
    where: { id },
    include: { homeTeam: true, awayTeam: true },
  });
}

export async function getMatchCounts(): Promise<{ upcoming: number; completed: number }> {
  const [upcoming, completed] = await Promise.all([
    prisma.match.count({ where: { status: { in: UPCOMING_STATUSES } } }),
    prisma.match.count({ where: { status: "COMPLETED" } }),
  ]);
  return { upcoming, completed };
}

/**
 * The following three are forward-looking for the public site (Phase 3, not
 * built yet): the soonest published fixture, the published upcoming list,
 * and the published results list. Written now, alongside the rest of the
 * query layer, so Phase 3 only has to build pages against them.
 */

export async function getPublicNextMatch(): Promise<Match | null> {
  return prisma.match.findFirst({
    where: { isPublished: true, status: { in: ["SCHEDULED", "LIVE"] } },
    orderBy: { scheduledAt: "asc" },
    include: { homeTeam: true, awayTeam: true },
  });
}

export async function getPublicUpcomingMatches(): Promise<Match[]> {
  return prisma.match.findMany({
    where: { isPublished: true, status: { in: UPCOMING_STATUSES } },
    orderBy: { scheduledAt: "asc" },
    include: { homeTeam: true, awayTeam: true },
  });
}

export async function getPublicResults(): Promise<Match[]> {
  return prisma.match.findMany({
    where: { isPublished: true, status: "COMPLETED" },
    orderBy: { scheduledAt: "desc" },
    include: { homeTeam: true, awayTeam: true },
  });
}
