"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { useLastOrderId } from "@/lib/storage/last-order";

/** Takes a returning customer back to their latest order, on the device that placed it. */
export function MyOrderLink() {
  const lastOrderId = useLastOrderId();
  const pathname = usePathname();

  if (!lastOrderId || pathname.startsWith("/order/")) return null;

  return (
    <ButtonLink href={`/order/${lastOrderId}`} variant="secondary" size="sm">
      My order
    </ButtonLink>
  );
}
