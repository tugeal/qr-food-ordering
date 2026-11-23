"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import styles from "./tabs.module.css";

type Item = { href: string; label: string; count?: number };

/** Page-level navigation as pills. The current page is highlighted. */
export function Tabs({ items, label }: { items: Item[]; label: string }) {
  const pathname = usePathname();

  return (
    <nav className={styles.tabs} aria-label={label}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(styles.tab, active && styles.active)}
          >
            {item.label}
            {item.count ? ` (${item.count})` : ""}
          </Link>
        );
      })}
    </nav>
  );
}
