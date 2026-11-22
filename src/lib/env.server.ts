import "server-only";
import { z } from "zod";

// Secrets live here, away from env.ts, so they can never be bundled for the browser.
const schema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
});

const parsed = schema.safeParse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
});

if (!parsed.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const serverEnv = parsed.data;
