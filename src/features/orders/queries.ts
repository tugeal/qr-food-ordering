import "server-only";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { toOrder } from "./mappers";
import type { LiveState } from "./status";
import type { Order } from "./types";

// Orders are read with the secret key, so the id must be a real UUID before it reaches the database.
// The random id in the URL is what keeps one customer from opening another's order.
const idSchema = z.uuid();

export async function getOrderByPublicId(publicId: string): Promise<Order | null> {
  if (!idSchema.safeParse(publicId).success) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, order_type, table_number, instructions, payment_method, payment_status, payment_reference, subtotal, total, created_at, order_items(item_name, unit_price, quantity, line_total)",
    )
    .eq("id", publicId)
    .order("item_name", { referencedTable: "order_items" })
    .maybeSingle();

  if (error) throw new Error(`Could not load the order: ${error.message}`);
  return data ? toOrder(data) : null;
}

/** Just the status and payment status: what the order page polls for. */
export async function getOrderLiveState(publicId: string): Promise<LiveState | null> {
  if (!idSchema.safeParse(publicId).success) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("status, payment_status")
    .eq("id", publicId)
    .maybeSingle();

  if (error) throw new Error(`Could not load the order status: ${error.message}`);
  return data ? { status: data.status, paymentStatus: data.payment_status } : null;
}
