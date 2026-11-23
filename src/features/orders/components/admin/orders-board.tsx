"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { ORDER_STATUSES, STATUS_LABEL } from "../../status";
import type { AdminOrder } from "../../types";
import { OrderCard } from "./order-card";
import styles from "./orders-board.module.css";

const FILTERS = ["all", ...ORDER_STATUSES] as const;
type Filter = (typeof FILTERS)[number];

/** Every order with a status filter. Refreshes itself, so new orders appear without a reload. */
export function OrdersBoard({ orders }: { orders: AdminOrder[] }) {
  useAutoRefresh();
  const [filter, setFilter] = useState<Filter>("all");

  const countOf = (value: Filter) =>
    value === "all" ? orders.length : orders.filter((order) => order.status === value).length;
  const visible = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter orders">
        {FILTERS.map((value) => (
          <Chip key={value} selected={filter === value} onClick={() => setFilter(value)}>
            {value === "all" ? "All" : STATUS_LABEL[value]} {countOf(value)}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState>No orders here yet. New orders appear on their own.</EmptyState>
      ) : (
        <div className={styles.list}>
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
