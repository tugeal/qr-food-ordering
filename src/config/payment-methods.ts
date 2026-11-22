/** The payment methods the system supports. The database restricts `code` to the same list. */
export const PAYMENT_METHOD_CODES = ["gcash", "maya", "bank_transfer"] as const;

export type PaymentMethodCode = (typeof PAYMENT_METHOD_CODES)[number];

export const PAYMENT_METHOD_NAMES: Record<PaymentMethodCode, string> = {
  gcash: "GCash",
  maya: "Maya",
  bank_transfer: "Bank transfer",
};

export function isPaymentMethodCode(value: unknown): value is PaymentMethodCode {
  return typeof value === "string" && (PAYMENT_METHOD_CODES as readonly string[]).includes(value);
}
