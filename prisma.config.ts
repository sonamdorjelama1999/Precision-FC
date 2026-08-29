import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 moved connection URLs out of schema.prisma and into this file.
 *
 * The CLI (migrate, db push, seed, studio) uses the URL below. On Supabase
 * that must be the DIRECT connection on port 5432 — the pooled connection
 * cannot run migrations.
 *
 * The application itself connects separately in src/lib/prisma.ts using
 * DATABASE_URL, the pooled connection on port 6543, which is what serverless
 * runtimes need.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
