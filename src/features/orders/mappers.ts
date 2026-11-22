import type { Database } from "@/types/database";
import type { Order } from "./types";

type Tables = Database["public"]["Tables"];

export type OrderRow = Pick<
  Tables["orders"]["Row"],
  | "id"
  | "order_number"
  | "status"
  | "order_type"
  | "table_number"
  | "instructions"
  | "subtotal"
  | "total"
  | "created_at"
> & {
  order_items: Pick<
    Tables["order_items"]["Row"],
    "item_name" | "unit_price" | "quantity" | "line_total"
  >[];
};

export function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    number: row.order_number,
    status: row.status,
    type: row.order_type,
    table: row.table_number,
    instructions: row.instructions,
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
