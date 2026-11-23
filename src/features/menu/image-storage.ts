import "server-only";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { menuImagePath } from "./image-url";

/** Only photos uploaded through the dashboard may be attached to a menu item. */
export function isOwnImageUrl(url: string): boolean {
  return menuImagePath(url, env.NEXT_PUBLIC_SUPABASE_URL) !== null;
}

/** Deletes a replaced or orphaned photo. Best effort: a leftover file does no harm. */
export async function removeMenuImage(url: string | null): Promise<void> {
  if (!url) return;

  const path = menuImagePath(url, env.NEXT_PUBLIC_SUPABASE_URL);
  if (!path) return;

  const { error } = await createAdminClient().storage.from("menu-images").remove([path]);
  if (error) console.error("Could not remove a menu photo:", error.message);
}
