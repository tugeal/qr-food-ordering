"use server";

import { z } from "zod";
import { createAction } from "@/lib/actions/create-action";
import { fail, ok } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";

const saveReferenceSchema = z.object({
  orderId: z.uuid(),
  reference: z
    .string()
    .trim()
    .min(1, "Enter your reference number.")
    .max(40, "That reference number is too long."),
});

/** Lets a customer with the order link attach the reference number from their payment receipt. */
export const saveReference = createAction(saveReferenceSchema, async ({ orderId, reference }) => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ payment_reference: reference })
    .eq("id", orderId)
    .eq("payment_status", "unpaid")
    .neq("status", "cancelled")
    .select("id");

  if (error) {
    console.error("saveReference failed:", error);
    return fail("We couldn’t save that. Please try again.");
  }
  if (!data?.length) return fail("This order can’t be updated anymore.");

  return ok({ saved: true });
});
