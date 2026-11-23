import "server-only";
import { cache } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { toAdminMenu, toMenuCategories } from "./mappers";

/** Active categories with their items, ready to render. Memoized per request. */
export const getMenu = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, name, sort_order, menu_items(id, name, description, price, emoji, image_url, is_available, sort_order)",
    )
    .eq("is_active", true);

  if (error) throw new Error(`Could not load the menu: ${error.message}`);
  return toMenuCategories(data ?? []);
});

/** The whole menu for the dashboard, sold-out items and empty categories included. Admin only. */
export async function getAdminMenu() {
  await requireAdmin();

  const supabase = createAdminClient();
  const [categories, items] = await Promise.all([
    supabase.from("categories").select("id, name, sort_order"),
    supabase
      .from("menu_items")
      .select("id, category_id, name, description, price, emoji, image_url, is_available, sort_order"),
  ]);

  if (categories.error) throw new Error(`Could not load categories: ${categories.error.message}`);
  if (items.error) throw new Error(`Could not load menu items: ${items.error.message}`);

  return toAdminMenu(categories.data ?? [], items.data ?? []);
}
