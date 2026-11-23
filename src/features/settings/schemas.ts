import { z } from "zod";
import { normalizeUrl } from "./url";

export const settingsSchema = z.object({
  restaurantName: z
    .string()
    .trim()
    .min(1, "Enter a restaurant name.")
    .max(50, "Keep the name under 50 characters."),
  // Empty means "use NEXT_PUBLIC_SITE_URL". A bare domain like menu.example.com gets https://.
  siteUrl: z
    .string()
    .trim()
    .max(300, "That address is too long.")
    .transform((value, ctx) => {
      if (value === "") return "";
      const url = normalizeUrl(value) ?? normalizeUrl(`https://${value}`);
      if (!url) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a web address, like https://menu.example.com.",
        });
        return z.NEVER;
      }
      return url;
    }),
});
