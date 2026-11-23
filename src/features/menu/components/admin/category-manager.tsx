"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActionRunner } from "@/hooks/use-action-runner";
import { deleteCategory, saveCategory } from "../../actions";
import type { AdminCategory } from "../../types";
import styles from "./category-manager.module.css";

function CategoryRow({ category }: { category: AdminCategory }) {
  const { run, error, pending } = useActionRunner();
  const [name, setName] = useState(category.name);
  const [confirming, setConfirming] = useState(false);
  const changed = name.trim() !== category.name;

  function askBeforeDeleting() {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 4000);
      return;
    }
    run(() => deleteCategory({ id: category.id }));
  }

  return (
    <div className={styles.item}>
      <div className={styles.line}>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label={`Name of ${category.name}`}
          maxLength={30}
        />
        {changed && (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => run(() => saveCategory({ id: category.id, name }))}
          >
            Save
          </Button>
        )}
        <Button variant="secondary" size="sm" disabled={pending} onClick={askBeforeDeleting}>
          {confirming ? "Sure?" : "Delete"}
        </Button>
      </div>
      <div className={styles.meta}>
        {category.itemCount} item{category.itemCount === 1 ? "" : "s"}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function AddCategory() {
  const { run, error, pending } = useActionRunner();
  const [name, setName] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(
      () => saveCategory({ name }),
      () => setName(""),
    );
  }

  return (
    <form onSubmit={submit} className={styles.item}>
      <div className={styles.line}>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New category, for example Desserts"
          aria-label="New category name"
          maxLength={30}
        />
        <Button type="submit" size="sm" disabled={pending}>
          Add
        </Button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  return (
    <Card className={styles.card}>
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
      <AddCategory />
    </Card>
  );
}
