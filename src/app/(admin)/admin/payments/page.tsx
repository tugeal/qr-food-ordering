import type { Metadata } from "next";
import { PaymentSettings } from "@/features/payments/components/admin/payment-settings";
import { getAdminPaymentMethods } from "@/features/payments/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payments" };

export default async function PaymentsAdminPage() {
  const methods = await getAdminPaymentMethods();
  return <PaymentSettings methods={methods} />;
}
