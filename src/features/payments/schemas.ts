import { z } from "zod";
import { PAYMENT_METHOD_CODES } from "@/config/payment-methods";

export const savePaymentMethodSchema = z
  .object({
    code: z.enum(PAYMENT_METHOD_CODES),
    displayName: z.string().trim().min(1, "Enter a name.").max(40, "Keep it under 40 characters."),
    accountName: z.string().trim().max(60, "Keep it under 60 characters.").default(""),
    accountNumber: z.string().trim().max(30, "Keep it under 30 characters.").default(""),
    bankName: z.string().trim().max(40, "Keep it under 40 characters.").default(""),
    instructions: z.string().trim().max(300, "Keep it under 300 characters.").default(""),
    isActive: z.boolean(),
  })
  .refine((method) => !method.isActive || method.accountNumber !== "", {
    path: ["accountNumber"],
    message: "Add the account number before switching this method on.",
  });
