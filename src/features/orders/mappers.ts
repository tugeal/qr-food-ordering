import { isPaymentMethodCode } from "@/config/payment-methods";
import type { Database } from "@/types/database";
import type { AdminOrder, Order } from "./types";

type Tables = Database["public"]["Tables"];

export type OrderRow = Pick<
  Tables["orders"]["Row"],
  | "id"
  | "order_number"
  | "status"
  | "order_type"
  | "table_number"
  | "instructions"
  | "payment_method"
  | "payment_status"
  | "payment_reference"
  | "subtotal"
  | "total"
  | "created_at"
> & {
  order_items: Pick<
    Tables["order_items"]["Row"],
    "item_name" | "unit_price" | "quantity" | "line_total"
  >[];
};

export type AdminOrderRow = OrderRow & Pick<Tables["orders"]["Row"], "customer_name" | "contact_number">;

export function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    number: row.order_number,
    status: row.status,
    type: row.order_type,
    table: row.table_number,
    instructions: row.instructions,
    // Orders placed before payment methods existed have none.
    paymentMethod: isPaymentMethodCode(row.payment_method) ? row.payment_method : null,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference,
    subtotal: row.subtotal,
    total: row.total,
    createdAt: row.created_at,
    items: row.order_items.map((item) => ({
      name: item.item_name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      lineTotal: item.line_total,
    })),
  };
}

export function toAdminOrder(row: AdminOrderRow): AdminOrder {
  return {
    ...toOrder(row),
    customerName: row.customer_name,
    contactNumber: row.contact_number,
  };
}
