import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { toPaymentMethod, toPaymentOptions } from "./mappers";
import type { PaymentMethod, PaymentOption } from "./types";

/** Methods the restaurant has switched on, for the checkout picker. Names only. */
export const getPaymentOptions = cache(async (): Promise<PaymentOption[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("code, display_name, sort_order")
    .eq("is_active", true);

  if (error) throw new Error(`Could not load payment options: ${error.message}`);
  return toPaymentOptions(data ?? []);
});

/**
 * Full account details. Only call this for an order that exists: it is how a customer with an
 * order link learns where to send money, and it keeps working if the method is switched off later.
 */
export async function getPaymentMethod(code: string): Promise<PaymentMethod | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("code, display_name, account_name, account_number, bank_name, instructions")
    .eq("code", code)
    .maybeSingle();

  if (error) throw new Error(`Could not load the payment method: ${error.message}`);
  return data ? toPaymentMethod(data) : null;
}
