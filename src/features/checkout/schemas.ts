import { z } from "zod";
import { PAYMENT_METHOD_CODES, type PaymentMethodCode } from "@/config/payment-methods";
import { normalizePhMobile } from "@/lib/format/phone";
import { honeypotSchema } from "@/lib/security/honeypot";

export const ORDER_TYPES = ["dine_in", "takeout"] as const;
export type OrderTypeValue = (typeof ORDER_TYPES)[number];

const MAX_LINE_QUANTITY = 20;
const NAME_MESSAGE = "Enter your name (2 to 60 characters).";

/** Everything the browser may send when placing an order. Prices are deliberately absent. */
export const checkoutSchema = z.object({
  name: z.string().trim().min(2, NAME_MESSAGE).max(60, NAME_MESSAGE),
  phone: z.string().transform((value, ctx) => {
    const phone = normalizePhMobile(value);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "Enter a valid mobile number, like 09171234567." });
      return z.NEVER;
    }
    return phone;
  }),
  orderType: z.enum(ORDER_TYPES),
  table: z.string().trim().max(10, "That table number is too long.").default(""),
  notes: z.string().trim().max(200, "Keep instructions under 200 characters.").default(""),
  paymentMethod: z.enum(PAYMENT_METHOD_CODES, { error: "Choose a payment method." }),
  website: honeypotSchema,
  items: z
    .array(
      z.object({
        itemId: z.uuid(),
        quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
      }),
    )
    .min(1, "Your cart is empty.")
    .max(30, "That’s too many different items."),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type { PaymentMethodCode };
