"use server";

import { createAction } from "@/lib/actions/create-action";
import { fail, ok } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";
import { settingsSchema } from "./schemas";

export const saveSettings = createAction(
  settingsSchema,
  async ({ restaurantName, siteUrl }) => {
    const { error } = await createAdminClient()
      .from("settings")
      .upsert(
        [
          { key: "restaurant_name", value: restaurantName },
          { key: "site_url", value: siteUrl },
        ],
        { onConflict: "key" },
      );

    if (error) {
      console.error("saveSettings failed:", error);
      return fail("We couldn’t save your settings. Please try again.");
    }
    return ok({ siteUrl });
  },
  { admin: true },
);
