import "server-only";

import { z } from "zod";

/**
 * Server environment, validated once at first import.
 *
 * If something is missing or malformed the app fails immediately with the
 * variable named, rather than throwing a confusing error deep inside a
 * database call later. Nothing here is ever bundled for the browser — the
 * "server-only" import above makes that a build error rather than a leak.
 */
const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (Supabase pooled connection, port 6543)"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required (Supabase direct connection, port 5432)"),

  NEXT_PUBLIC_SUPABASE_URL: z.url("NEXT_PUBLIC_SUPABASE_URL must be a URL, e.g. https://xxxx.supabase.co"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("Precision"),

  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters — generate one with: openssl rand -base64 32"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${details}\n\nCheck .env.local against .env.example.`);
}

export const env = parsed.data;
