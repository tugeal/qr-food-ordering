import type { ReactNode } from "react";
import type { MenuCategory } from "../types";
import styles from "./menu-grid.module.css";
import { MenuItemCard } from "./menu-item-card";

type Props = {
  categories: MenuCategory[];
  /** Per-item controls keyed by item id, supplied by the page. */
  itemActions?: Record<string, ReactNode>;
};

export function MenuGrid({ categories, itemActions }: Props) {
  return (
    <>
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`category-${category.id}`}>
          <h2 id={`category-${category.id}`}>{category.name}</h2>
          <div className={styles.grid}>
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} action={itemActions?.[item.id]} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
