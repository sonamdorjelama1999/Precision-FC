import "server-only";

import { prisma } from "@/lib/prisma";
import type { Sponsor, StaffMember } from "@/types";

/**
 * The single door to coaching staff and sponsor data — same contract the
 * player and fixture queries follow.
 *
 * Both are ordered by displayOrder first so the admin controls the sequence
 * shown publicly, with name as a stable tie-break.
 */

export async function getStaff(): Promise<StaffMember[]> {
  return prisma.staffMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
}

export async function getStaffMemberById(id: string): Promise<StaffMember | null> {
  return prisma.staffMember.findUnique({ where: { id } });
}

export async function getSponsors(): Promise<Sponsor[]> {
  return prisma.sponsor.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
}

export async function getSponsorById(id: string): Promise<Sponsor | null> {
  return prisma.sponsor.findUnique({ where: { id } });
}
