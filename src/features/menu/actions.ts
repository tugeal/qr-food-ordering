"use server";

import { createAction } from "@/lib/actions/create-action";
import { fail, ok, type Result } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";
import { isOwnImageUrl, removeMenuImage } from "./image-storage";
import { availabilitySchema, idSchema, saveCategorySchema, saveMenuItemSchema } from "./schemas";

const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const DEFAULT_EMOJI = "🍽️";
const CATEGORY_IN_USE = "Move or delete the food in this category first.";

async function nextCategorySort(): Promise<number> {
  const { data } = await createAdminClient()
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return (data?.[0]?.sort_order ?? 0) + 1;
}

async function nextItemSort(categoryId: string): Promise<number> {
  const { data } = await createAdminClient()
    .from("menu_items")
    .select("sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: false })
    .limit(1);
  return (data?.[0]?.sort_order ?? 0) + 1;
}

function itemError(error: { code?: string; message: string }): Result<never> {
  if (error.code === FOREIGN_KEY_VIOLATION) {
    return fail("That category no longer exists.", { categoryId: ["That category no longer exists."] });
  }
  console.error("saveMenuItem failed:", error);
  return fail("We couldn’t save the item. Please try again.");
}

// ---- Categories ----

export const saveCategory = createAction(
  saveCategorySchema,
  async ({ id, name }) => {
    const supabase = createAdminClient();
    const { error } = id
      ? await supabase.from("categories").update({ name }).eq("id", id)
      : await supabase.from("categories").insert({ name, sort_order: await nextCategorySort() });

    if (error?.code === UNIQUE_VIOLATION) {
      return fail("That category already exists.", { name: ["That category already exists."] });
    }
    if (error) {
      console.error("saveCategory failed:", error);
      return fail("We couldn’t save the category. Please try again.");
    }
    return ok({ saved: true });
  },
  { admin: true },
);

export const deleteCategory = createAction(
  idSchema,
  async ({ id }) => {
    const supabase = createAdminClient();

    const { count, error: countError } = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);
    if (countError) {
      console.error("deleteCategory failed:", countError);
      return fail("We couldn’t delete the category. Please try again.");
    }
    if (count) return fail(CATEGORY_IN_USE);

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error?.code === FOREIGN_KEY_VIOLATION) return fail(CATEGORY_IN_USE);
    if (error) {
      console.error("deleteCategory failed:", error);
      return fail("We couldn’t delete the category. Please try again.");
    }
    return ok({ deleted: true });
  },
  { admin: true },
);

// ---- Food items ----

export const saveMenuItem = createAction(
  saveMenuItemSchema,
  async (input) => {
    if (input.imageUrl && !isOwnImageUrl(input.imageUrl)) {
      return fail("Please upload the photo again.", { imageUrl: ["Please upload the photo again."] });
    }

    const supabase = createAdminClient();
    const fields = {
      category_id: input.categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      emoji: input.emoji || DEFAULT_EMOJI,
      image_url: input.imageUrl || null,
      is_available: input.isAvailable,
    };

    if (input.id) {
      const { data: existing } = await supabase
        .from("menu_items")
        .select("image_url")
        .eq("id", input.id)
        .maybeSingle();

      const { error } = await supabase.from("menu_items").update(fields).eq("id", input.id);
      if (error) return itemError(error);

      // The photo was replaced or removed: delete the old file.
      if (existing?.image_url && existing.image_url !== fields.image_url) {
        await removeMenuImage(existing.image_url);
      }
    } else {
      const sort_order = await nextItemSort(input.categoryId);
      const { error } = await supabase.from("menu_items").insert({ ...fields, sort_order });
      if (error) return itemError(error);
    }

    return ok({ saved: true });
  },
  { admin: true },
);

export const setItemAvailability = createAction(
  availabilitySchema,
  async ({ id, isAvailable }) => {
    const { data, error } = await createAdminClient()
      .from("menu_items")
      .update({ is_available: isAvailable })
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("setItemAvailability failed:", error);
      return fail("We couldn’t update the item. Please try again.");
    }
    if (!data?.length) return fail("That item no longer exists.");
    return ok({ updated: true });
  },
  { admin: true },
);

export const deleteMenuItem = createAction(
  idSchema,
  async ({ id }) => {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("menu_items")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    // Past orders keep their copied names and prices: order_items.menu_item_id just becomes null.
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      console.error("deleteMenuItem failed:", error);
      return fail("We couldn’t delete the item. Please try again.");
    }

    await removeMenuImage(existing?.image_url ?? null);
    return ok({ deleted: true });
  },
  { admin: true },
);
