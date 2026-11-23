import type { Metadata } from "next";
import { OrdersBoard } from "@/features/orders/components/admin/orders-board";
import { listOrders } from "@/features/orders/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const orders = await listOrders();
  return <OrdersBoard orders={orders} />;
}
