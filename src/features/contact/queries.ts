import "server-only";

import { prisma } from "@/lib/prisma";
import type { ContactMessage } from "@/types";

/**
 * The single door to ContactMessage data. There is no public read path —
 * every query here is for the admin inbox.
 */

export async function getMessages(): Promise<ContactMessage[]> {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMessageById(id: string): Promise<ContactMessage | null> {
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function getUnreadMessageCount(): Promise<number> {
  return prisma.contactMessage.count({ where: { isRead: false } });
}
