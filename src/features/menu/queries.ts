import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { toMenuCategories } from "./mappers";

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
