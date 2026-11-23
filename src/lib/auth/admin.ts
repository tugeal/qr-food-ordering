import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

/** Is this user on the admins list? Uses the secret key, so only call it for a verified user id. */
export async function isAdminUserId(userId: string): Promise<boolean> {
  const { data } = await createAdminClient()
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data !== null;
}

/**
 * The signed-in admin, or null. Supabase Auth verifies the session (getClaims checks the token),
 * and the admins table grants the role. Call it again in every page, action and route handler:
 * a layout check alone is not enough.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims?.sub || !(await isAdminUserId(claims.sub))) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
});

/** For pages and data access: sends anyone who isn't a signed-in admin to the login page. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}
