import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

/**
 * Supabase client for storage work, authenticated with the service-role key.
 *
 * This module is server-only and must stay that way: the service-role key
 * bypasses every row-level security policy, so it can never reach the
 * browser. Nothing in components/ may import this — only server actions and
 * other server modules.
 *
 * Session persistence is off because there is no user session here; each call
 * is a one-shot privileged request.
 */
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

export const STORAGE_BUCKET = env.SUPABASE_STORAGE_BUCKET;
