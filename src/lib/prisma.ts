import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@prisma/client";

import { env } from "@/lib/env";

/**
 * Prisma singleton.
 *
 * In development Next.js hot-reloads modules on every edit; without the
 * global cache each reload would open a fresh connection pool until the
 * database refuses new clients. In production the module is evaluated once,
 * so the global is skipped.
 *
 * Prisma 7 requires a driver adapter for PostgreSQL — PrismaPg here, pointed
 * at the pooled Supabase connection.
 */
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
