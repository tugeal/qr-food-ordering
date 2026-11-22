import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./status-badge.module.css";

export type StatusTone = "pending" | "confirmed" | "preparing" | "completed" | "cancelled";

/** Order status as a pill. Monochrome: the state shows in fill, outline and strike-through. */
export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return <span className={cn(styles.badge, styles[tone])}>{children}</span>;
}
