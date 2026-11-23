import { z } from "zod";

const roundToCentavos = (value: number) => Math.round(value * 100) / 100;

export const saveCategorySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Enter a category name.").max(30, "Keep it under 30 characters."),
});

export const idSchema = z.object({ id: z.uuid() });

export const saveMenuItemSchema = z.object({
  id: z.uuid().optional(),
  categoryId: z.uuid({ error: "Choose a category." }),
  name: z.string().trim().min(1, "Enter a name.").max(60, "Keep the name under 60 characters."),
  description: z.string().trim().max(100, "Keep the description under 100 characters.").default(""),
  price: z
    .number({ error: "Enter a price, like 150." })
    .min(0, "The price can’t be negative.")
    .max(99999.99, "That price is too high.")
    .transform(roundToCentavos),
  emoji: z.string().trim().max(8, "Use a single emoji.").default(""),
  imageUrl: z.string().trim().max(500).default(""),
  isAvailable: z.boolean(),
});

export const availabilitySchema = z.object({
  id: z.uuid(),
  isAvailable: z.boolean(),
});
