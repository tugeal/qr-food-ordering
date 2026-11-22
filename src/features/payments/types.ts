import type { PaymentMethodCode } from "@/config/payment-methods";

/** What checkout shows: just the name. Account details stay on the server until an order exists. */
export type PaymentOption = {
  code: PaymentMethodCode;
  name: string;
};

export type PaymentMethod = PaymentOption & {
  accountName: string;
  accountNumber: string;
  bankName: string;
  instructions: string;
};
