const BUCKET = "menu-images";

/** The storage path of one of our menu photos inside the bucket, or null for any other address. */
export function menuImagePath(url: string, supabaseUrl: string): string | null {
  const prefix = `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/${BUCKET}/`;
  if (!url.startsWith(prefix)) return null;

  const path = url.slice(prefix.length);
  return /^items\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path) ? path : null;
}
