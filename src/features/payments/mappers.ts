import {
  isPaymentMethodCode,
  PAYMENT_METHOD_CODES,
  PAYMENT_METHOD_NAMES,
} from "@/config/payment-methods";
import type { Database } from "@/types/database";
import type { AdminPaymentMethod, PaymentMethod, PaymentOption } from "./types";

type Row = Database["public"]["Tables"]["payment_methods"]["Row"];

export type PaymentOptionRow = Pick<Row, "code" | "display_name" | "sort_order">;
export type PaymentMethodRow = Pick<
  Row,
  "code" | "display_name" | "account_name" | "account_number" | "bank_name" | "instructions"
>;
export type AdminPaymentRow = PaymentMethodRow & Pick<Row, "is_active">;

/** Active methods in display order. Rows with a code this app doesn't know are ignored. */
export function toPaymentOptions(rows: PaymentOptionRow[]): PaymentOption[] {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((row) =>
      isPaymentMethodCode(row.code)
        ? [{ code: row.code, name: row.display_name || PAYMENT_METHOD_NAMES[row.code] }]
        : [],
    );
}

export function toPaymentMethod(row: PaymentMethodRow): PaymentMethod | null {
  if (!isPaymentMethodCode(row.code)) return null;

  return {
    code: row.code,
    name: row.display_name || PAYMENT_METHOD_NAMES[row.code],
    accountName: row.account_name,
    accountNumber: row.account_number,
    bankName: row.bank_name,
    instructions: row.instructions,
  };
}

/** Every supported method, in a fixed order, with blanks for any row missing from the database. */
export function toAdminPaymentMethods(rows: AdminPaymentRow[]): AdminPaymentMethod[] {
  return PAYMENT_METHOD_CODES.map((code) => {
    const row = rows.find((candidate) => candidate.code === code);
    return {
      code,
      name: row?.display_name || PAYMENT_METHOD_NAMES[code],
      accountName: row?.account_name ?? "",
      accountNumber: row?.account_number ?? "",
      bankName: row?.bank_name ?? "",
      instructions: row?.instructions ?? "",
      isActive: row?.is_active ?? false,
    };
  });
}
