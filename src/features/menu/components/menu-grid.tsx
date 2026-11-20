import type { MenuCategory } from "../types";
import styles from "./menu-grid.module.css";
import { MenuItemCard } from "./menu-item-card";

export function MenuGrid({ categories }: { categories: MenuCategory[] }) {
  return (
    <>
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`category-${category.id}`}>
          <h2 id={`category-${category.id}`}>{category.name}</h2>
          <div className={styles.grid}>
            {category.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
