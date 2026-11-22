import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

/**
 * Supabase client with the secret key. It bypasses row level security, so use it only in
 * server code, always after validating input, and never return raw rows to the browser.
 */
export function createAdminClient() {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
