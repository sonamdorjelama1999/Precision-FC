import "server-only";

import { prisma } from "@/lib/prisma";
import type { Player } from "@/types";

/**
 * The single door between the site and player data.
 *
 * Everything above this returns the plain domain types in src/types, so no
 * component ever touches a Prisma model directly and swapping the storage
 * layer again would touch only this file.
 */

export async function getPlayers(options?: { teamId?: string }): Promise<Player[]> {
  return prisma.player.findMany({
    where: options?.teamId ? { teamId: options.teamId } : undefined,
    orderBy: [{ playerNumber: "asc" }, { name: "asc" }],
    include: { team: true },
  });
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return prisma.player.findUnique({ where: { id }, include: { team: true } });
}
