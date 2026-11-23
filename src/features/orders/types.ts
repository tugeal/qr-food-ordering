import type { PaymentMethodCode } from "@/config/payment-methods";
import type { OrderStatus, PaymentStatus } from "./status";

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
  paymentMethod: PaymentMethodCode | null;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  subtotal: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

/** An order as the restaurant sees it: with the customer's name and number. */
export type AdminOrder = Order & {
  customerName: string;
  contactNumber: string;
};
