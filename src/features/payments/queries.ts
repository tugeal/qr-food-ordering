import "server-only";
import { cache } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { toAdminPaymentMethods, toPaymentMethod, toPaymentOptions } from "./mappers";
import type { AdminPaymentMethod, PaymentMethod, PaymentOption } from "./types";

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

/** Every method, switched on or off, for the dashboard. */
export async function getAdminPaymentMethods(): Promise<AdminPaymentMethod[]> {
  await requireAdmin();

  const { data, error } = await createAdminClient()
    .from("payment_methods")
    .select("code, display_name, account_name, account_number, bank_name, instructions, is_active");

  if (error) throw new Error(`Could not load payment methods: ${error.message}`);
  return toAdminPaymentMethods(data ?? []);
}
