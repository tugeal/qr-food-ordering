"use server";

import { PAYMENT_METHOD_CODES } from "@/config/payment-methods";
import { createAction } from "@/lib/actions/create-action";
import { fail, ok } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";
import { savePaymentMethodSchema } from "./schemas";

export const savePaymentMethod = createAction(
  savePaymentMethodSchema,
  async (method) => {
    const { error } = await createAdminClient()
      .from("payment_methods")
      .upsert(
        {
          code: method.code,
          display_name: method.displayName,
          account_name: method.accountName,
          account_number: method.accountNumber,
          bank_name: method.code === "bank_transfer" ? method.bankName : "",
          instructions: method.instructions,
          is_active: method.isActive,
          sort_order: PAYMENT_METHOD_CODES.indexOf(method.code) + 1,
        },
        { onConflict: "code" },
      );

    if (error) {
      console.error("savePaymentMethod failed:", error);
      return fail("We couldn’t save this payment method. Please try again.");
    }
    return ok({ saved: true });
  },
  { admin: true },
);
