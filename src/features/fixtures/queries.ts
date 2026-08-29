import "server-only";

import { prisma } from "@/lib/prisma";
import type { Fixture } from "@/types";

/**
 * Fixtures with their goal events. The scoreline is never read from the
 * database — lib/stats.ts counts it from the events, which is what stops the
 * results page and the squad page from ever disagreeing.
 */
export async function getFixtures(): Promise<Fixture[]> {
  const fixtures = await prisma.fixture.findMany({
    orderBy: { date: "asc" },
    include: {
      events: {
        orderBy: [{ minute: "asc" }, { createdAt: "asc" }],
        include: { player: { select: { name: true } } },
      },
    },
  });

  return fixtures.map((fixture) => ({
    id: fixture.id,
    date: fixture.date,
    opponent: fixture.opponent,
    isHome: fixture.isHome,
    status: fixture.status,
    competition: fixture.competition,
    kickoff: fixture.kickoff,
    note: fixture.note,
    events: fixture.events.map((event) => ({
      id: event.id,
      team: event.team,
      minute: event.minute,
      // A linked squad member's current name wins over the stored text, so
      // renaming a player in the CMS updates every timeline they appear in.
      scorerName: event.player?.name ?? event.scorerName,
      assistName: event.assistName,
      playerId: event.playerId,
    })),
  }));
}

export async function getFixtureById(id: string): Promise<Fixture | null> {
  const fixtures = await getFixtures();
  return fixtures.find((fixture) => fixture.id === id) ?? null;
}
