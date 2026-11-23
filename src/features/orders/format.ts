import type { Order } from "./types";

/** Where the order is eaten: "Dine-in · Table 4", "Dine-in" or "Takeout". */
export function describePlace(order: Pick<Order, "type" | "table">): string {
  if (order.type === "takeout") return "Takeout";
  return order.table ? `Dine-in · Table ${order.table}` : "Dine-in";
}
