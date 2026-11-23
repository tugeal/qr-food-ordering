"use server";

import { z } from "zod";
import { createAction } from "@/lib/actions/create-action";
import { fail, ok } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "./status";

// ---- Customer ----

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

// ---- Admin ----

const updateStatusSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(ORDER_STATUSES),
});

export const updateOrderStatus = createAction(
  updateStatusSchema,
  async ({ orderId, status }) => {
    const { data, error } = await createAdminClient()
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("id");

    if (error) {
      console.error("updateOrderStatus failed:", error);
      return fail("We couldn’t update the order. Please try again.");
    }
    if (!data?.length) return fail("That order no longer exists.");
    return ok({ updated: true });
  },
  { admin: true },
);

const setPaymentSchema = z.object({
  orderId: z.uuid(),
  paymentStatus: z.enum(PAYMENT_STATUSES),
});

export const setPaymentStatus = createAction(
  setPaymentSchema,
  async ({ orderId, paymentStatus }) => {
    const { data, error } = await createAdminClient()
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", orderId)
      .select("id");

    if (error) {
      console.error("setPaymentStatus failed:", error);
      return fail("We couldn’t update the payment. Please try again.");
    }
    if (!data?.length) return fail("That order no longer exists.");
    return ok({ updated: true });
  },
  { admin: true },
);
