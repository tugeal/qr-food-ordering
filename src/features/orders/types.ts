import type { OrderStatus } from "./status";

export type OrderType = "dine_in" | "takeout";

export type OrderItem = {
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  /** Random id used in the customer's link. Not the order number. */
  id: string;
  number: number;
  status: OrderStatus;
  type: OrderType;
  table: string | null;
  instructions: string | null;
  subtotal: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
};
