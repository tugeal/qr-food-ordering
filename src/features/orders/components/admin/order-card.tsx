"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { PAYMENT_METHOD_NAMES } from "@/config/payment-methods";
import type { Result } from "@/lib/actions/result";
import { formatPeso } from "@/lib/format/currency";
import { formatOrderTime } from "@/lib/format/datetime";
import { cn } from "@/lib/utils";
import { setPaymentStatus, updateOrderStatus } from "../../actions";
import { describePlace } from "../../format";
import { isOrderStatus, ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from "../../status";
import type { AdminOrder } from "../../types";
import styles from "./order-card.module.css";

export function OrderCard({ order }: { order: AdminOrder }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const paid = order.paymentStatus === "paid";
  const paymentName = order.paymentMethod ? PAYMENT_METHOD_NAMES[order.paymentMethod] : "No payment method";

  function run(task: () => Promise<Result<unknown>>) {
    setError(null);
    startTransition(async () => {
      const result = await task();
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  }

  const changeStatus = (status: OrderStatus) =>
    run(() => updateOrderStatus({ orderId: order.id, status }));

  const togglePaid = () =>
    run(() => setPaymentStatus({ orderId: order.id, paymentStatus: paid ? "unpaid" : "paid" }));

  return (
    <Card className={cn(styles.root, order.status === "pending" && styles.new)}>
      <div className={styles.row}>
        <b>
          #{order.number} · {order.customerName}
        </b>
        <StatusBadge tone={order.status}>{STATUS_LABEL[order.status]}</StatusBadge>
      </div>

      <div className={styles.meta}>
        {describePlace(order)} · {formatPeso(order.total)} · {paymentName} ·{" "}
        {paid ? "Paid" : "Unpaid"}
        {order.paymentReference ? ` · Ref ${order.paymentReference}` : ""} ·{" "}
        {formatOrderTime(order.createdAt)}
      </div>

      <div className={styles.controls}>
        <Select
          aria-label="Order status"
          value={order.status}
          disabled={pending}
          onChange={(event) => {
            const next = event.target.value;
            if (isOrderStatus(next)) changeStatus(next);
          }}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </Select>
        <Button variant="secondary" size="sm" disabled={pending} onClick={togglePaid}>
          {paid ? "Mark unpaid" : "Mark paid"}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setOpen((value) => !value)}>
          {open ? "Hide" : "Details"}
        </Button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {open && (
        <div className={styles.details}>
          {order.items.map((item, index) => (
            <div key={`${item.name}-${index}`} className={styles.row}>
              <span>
                {item.quantity} × {item.name}
              </span>
              <span className={styles.amount}>{formatPeso(item.lineTotal)}</span>
            </div>
          ))}
          <div className={styles.meta}>
            Phone: {order.contactNumber}
            {order.instructions && (
              <>
                <br />
                Note: {order.instructions}
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
