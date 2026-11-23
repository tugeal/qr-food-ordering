"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminCategory, AdminMenuItem } from "../../types";
import { CategoryManager } from "./category-manager";
import { ItemEditor } from "./item-editor";
import { ItemList } from "./item-list";
import styles from "./menu-manager.module.css";

type Props = { categories: AdminCategory[]; items: AdminMenuItem[] };

/** The Menu tab: categories, an editor for one item at a time, and the list of food. */
export function MenuManager({ categories, items }: Props) {
  // undefined: editor closed. null: adding a new item. An item: editing it.
  const [editing, setEditing] = useState<AdminMenuItem | null | undefined>(undefined);

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h3>Categories</h3>
        <CategoryManager categories={categories} />
      </section>

      <section className={styles.section}>
        <div className={styles.heading}>
          <h3>Food items</h3>
          <Button size="sm" onClick={() => setEditing(null)}>
            Add item
          </Button>
        </div>

        {editing !== undefined && (
          <ItemEditor
            key={editing?.id ?? "new"}
            item={editing}
            categories={categories}
            onClose={() => setEditing(undefined)}
          />
        )}

        <ItemList items={items} categories={categories} onEdit={setEditing} />
      </section>
    </div>
  );
}
