"use server";

import { createAction } from "@/lib/actions/create-action";
import { fail, ok } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutSchema } from "./schemas";

const KNOWN_ERRORS = ["items_unavailable", "rate_limited", "invalid_items"];

function describeError(error: { message: string; details?: string | null }): string {
  switch (error.message) {
    case "items_unavailable": {
      const names = error.details || "Some items";
      const many = names.includes(",");
      return `${names} ${many ? "are" : "is"} no longer available. Remove ${many ? "them" : "it"} from your cart to continue.`;
    }
    case "rate_limited":
      return "Too many orders from this number. Please wait a few minutes and try again.";
    case "invalid_items":
      return "We couldn’t read your cart. Refresh the page and try again.";
    default:
      return "We couldn’t place your order. Please try again.";
  }
}

/**
 * Places an order. The browser sends item ids and quantities only; the create_order database
 * function checks availability and prices everything from the menu in one transaction.
 */
export const placeOrder = createAction(checkoutSchema, async (input) => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: input.name,
    p_contact_number: input.phone,
    p_order_type: input.orderType,
    p_table_number: input.orderType === "dine_in" ? input.table : "",
    p_instructions: input.notes,
    p_items: input.items.map((item) => ({ menu_item_id: item.itemId, quantity: item.quantity })),
  });

  if (error) {
    if (!KNOWN_ERRORS.includes(error.message)) console.error("create_order failed:", error);
    return fail(describeError(error));
  }

  const created = data?.[0];
  if (!created) return fail(describeError({ message: "unknown" }));

  return ok({ orderId: created.new_order_id, orderNumber: created.new_order_number });
});
