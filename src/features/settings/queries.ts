import "server-only";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "./url";

const getSettings = cache(async (): Promise<Record<string, string>> => {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");

  const settings: Record<string, string> = {};
  for (const row of data ?? []) settings[row.key] = row.value;
  return settings;
});

export async function getRestaurantName(): Promise<string> {
  const settings = await getSettings();
  return settings.restaurant_name?.trim() || siteConfig.defaultName;
}

/** The address printed in the QR code: the `site_url` setting, else NEXT_PUBLIC_SITE_URL. */
export async function getMenuUrl(): Promise<string> {
  const settings = await getSettings();
  return (
    normalizeUrl(settings.site_url) ?? normalizeUrl(env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000/"
  );
}
