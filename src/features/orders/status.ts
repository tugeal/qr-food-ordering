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

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Position on the happy path, or -1 for cancelled. */
export function progressIndex(status: OrderStatus): number {
  return PROGRESS_STEPS.indexOf(status);
}

/** Final orders stop changing, so there is no point polling for them. */
export function isFinalStatus(status: OrderStatus): boolean {
  return status === "completed" || status === "cancelled";
}
