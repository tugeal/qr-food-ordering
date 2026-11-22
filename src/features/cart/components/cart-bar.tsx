"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { formatPeso } from "@/lib/format/currency";
import { useCart } from "../cart-provider";
import styles from "./cart-bar.module.css";

/** The floating "View cart" pill, shown on the menu once something is in the cart. */
export function CartBar() {
  const pathname = usePathname();
  const { count, subtotal } = useCart();

  if (pathname !== "/" || count === 0) return null;

  return (
    <div className={styles.bar}>
      <ButtonLink href="/cart" className={styles.link}>
        <span>
          View cart · {count} item{count > 1 ? "s" : ""}
        </span>
        <span className={styles.total}>{formatPeso(subtotal)}</span>
      </ButtonLink>
    </div>
  );
}
