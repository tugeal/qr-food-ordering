export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** The happy path, in order. Cancelled sits outside it. */
export const PROGRESS_STEPS: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "completed",
];

export const PAYMENT_STATUSES = ["unpaid", "paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** What the order page polls for. */
export type LiveState = { status: OrderStatus; paymentStatus: PaymentStatus };

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && (PAYMENT_STATUSES as readonly string[]).includes(value);
}

/** Reads the polling response, ignoring anything that isn't a valid status pair. */
export function parseLiveState(data: unknown): LiveState | null {
  if (typeof data !== "object" || data === null) return null;

  const { status, paymentStatus } = data as Record<string, unknown>;
  return isOrderStatus(status) && isPaymentStatus(paymentStatus) ? { status, paymentStatus } : null;
}

/** Position on the happy path, or -1 for cancelled. */
export function progressIndex(status: OrderStatus): number {
  return PROGRESS_STEPS.indexOf(status);
}

/** Nothing left to wait for: cancelled, or completed and paid. Polling can stop. */
export function isSettled(status: OrderStatus, paymentStatus: PaymentStatus): boolean {
  return status === "cancelled" || (status === "completed" && paymentStatus === "paid");
}
