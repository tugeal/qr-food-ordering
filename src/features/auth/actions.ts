"use server";

import { z } from "zod";
import { createAction } from "@/lib/actions/create-action";
import { fail, ok } from "@/lib/actions/result";
import { isAdminUserId } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "./schemas";

export const signIn = createAction(signInSchema, async ({ email, password }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error?.code === "email_not_confirmed") {
    return fail("This email isn’t confirmed yet. Confirm it in Supabase, under Authentication, Users.");
  }
  if (error || !data.user) return fail("Wrong email or password.");

  // A valid Supabase account is not enough: it must also be on the admins list.
  if (!(await isAdminUserId(data.user.id))) {
    await supabase.auth.signOut();
    return fail("This account doesn’t have admin access.");
  }

  return ok({ redirectTo: "/admin/orders" });
});

export const signOut = createAction(z.object({}), async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return ok({ done: true });
});
