import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * A small, honest test suite — not a full pyramid. It covers the parts of
 * the app that are actually unit-testable without mocking Prisma or
 * Supabase: the date/format helpers, slugify(), and the Zod validation
 * schemas. Everything else here (queries, Server Actions, components) talks
 * to the database or the DOM and belongs in integration or e2e coverage this
 * project doesn't have yet, rather than being faked out to hit a number.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
