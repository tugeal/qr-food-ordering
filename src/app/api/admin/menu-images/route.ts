import { randomUUID } from "node:crypto";
import { getAdminUser } from "@/lib/auth/admin";
import { detectImageType, IMAGE_EXTENSION, IMAGE_MIME } from "@/lib/storage/image-type";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024;

/** POST /api/admin/menu-images (multipart, field "file"): stores a food photo and returns its public URL. */
export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose a photo to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "That photo is over 2 MB." }, { status: 413 });
  }

  // Trust the file's first bytes, not its name or declared type.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return Response.json({ error: "Use a JPG, PNG or WebP photo." }, { status: 415 });
  }

  const path = `items/${randomUUID()}.${IMAGE_EXTENSION[type]}`;
  const storage = createAdminClient().storage.from("menu-images");

  const { error } = await storage.upload(path, bytes, {
    contentType: IMAGE_MIME[type],
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("Menu photo upload failed:", error.message);
    return Response.json({ error: "The upload failed. Please try again." }, { status: 500 });
  }

  return Response.json({ url: storage.getPublicUrl(path).data.publicUrl });
}
