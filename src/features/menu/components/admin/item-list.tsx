"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useActionRunner } from "@/hooks/use-action-runner";
import { formatPeso } from "@/lib/format/currency";
import { deleteMenuItem, setItemAvailability } from "../../actions";
import type { AdminCategory, AdminMenuItem } from "../../types";
import styles from "./item-list.module.css";

type RowProps = { item: AdminMenuItem; categoryName: string; onEdit: () => void };

function ItemRow({ item, categoryName, onEdit }: RowProps) {
  const { run, error, pending } = useActionRunner();
  const [confirming, setConfirming] = useState(false);

  function askBeforeDeleting() {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 4000);
      return;
    }
    run(() => deleteMenuItem({ id: item.id }));
  }

  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <div className={styles.thumb}>
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt="" width={52} height={52} className={styles.image} />
          ) : (
            <span className={styles.emoji} aria-hidden="true">
              {item.emoji}
            </span>
          )}
        </div>
        <div>
          <b>{item.name}</b>
          <div className={styles.meta}>
            {formatPeso(item.price)} · {categoryName}
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => run(() => setItemAvailability({ id: item.id, isAvailable: !item.isAvailable }))}
        >
          {item.isAvailable ? "Available" : "Sold out"}
        </Button>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="secondary" size="sm" disabled={pending} onClick={askBeforeDeleting}>
          {confirming ? "Sure?" : "Delete"}
        </Button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}

type Props = {
  items: AdminMenuItem[];
  categories: AdminCategory[];
  onEdit: (item: AdminMenuItem) => void;
};

export function ItemList({ items, categories, onEdit }: Props) {
  if (items.length === 0) return <EmptyState>No food items yet.</EmptyState>;

  const names = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          categoryName={names.get(item.categoryId) ?? "No category"}
          onEdit={() => onEdit(item)}
        />
      ))}
    </div>
  );
}
