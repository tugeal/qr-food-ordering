import Image from "next/image";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import type { MenuItem } from "../types";
import styles from "./menu-item-card.module.css";

const IMAGE_SIZES = "(min-width: 900px) 25vw, (min-width: 640px) 33vw, 50vw";

type Props = {
  item: MenuItem;
  /** Shown for available items, for example an Add to cart control supplied by the page. */
  action?: ReactNode;
};

export function MenuItemCard({ item, action }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes={IMAGE_SIZES}
            className={styles.image}
          />
        ) : (
          <span className={styles.emoji} aria-hidden="true">
            {item.emoji}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h3>{item.name}</h3>
        {item.description && <p className={styles.description}>{item.description}</p>}
        <div className={styles.footer}>
          <Price value={item.price} />
          {item.isAvailable ? action : <Badge>Sold out</Badge>}
        </div>
      </div>
    </article>
  );
}
