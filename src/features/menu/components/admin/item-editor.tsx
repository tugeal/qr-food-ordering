"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Checkbox, Input, Select } from "@/components/ui/input";
import { saveMenuItem } from "../../actions";
import type { AdminCategory, AdminMenuItem } from "../../types";
import styles from "./item-editor.module.css";
import { ImageUpload } from "./image-upload";

type Props = {
  /** The item being edited, or null for a new one. */
  item: AdminMenuItem | null;
  categories: AdminCategory[];
  onClose: () => void;
};

export function ItemEditor({ item, categories, onClose }: Props) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item ? String(item.price) : "",
    categoryId: item?.categoryId ?? "",
    emoji: item?.emoji ?? "🍽️",
    imageUrl: item?.imageUrl ?? "",
    isAvailable: item?.isAvailable ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const errorOf = (field: string) => errors[field]?.[0];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);

    startTransition(async () => {
      const result = await saveMenuItem({
        id: item?.id,
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        price: values.price.trim() === "" ? undefined : Number(values.price),
        emoji: values.emoji,
        imageUrl: values.imageUrl,
        isAvailable: values.isAvailable,
      });

      if (result.ok) {
        router.refresh();
        onClose();
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error);
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card>
        <h3>{item ? "Edit item" : "New item"}</h3>

        <Field label="Name" htmlFor="item-name" error={errorOf("name")}>
          <Input
            id="item-name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            maxLength={60}
          />
        </Field>

        <Field label="Short description" htmlFor="item-description" error={errorOf("description")}>
          <Input
            id="item-description"
            value={values.description}
            onChange={(event) => set("description", event.target.value)}
            maxLength={100}
          />
        </Field>

        <Field label="Price (₱)" htmlFor="item-price" error={errorOf("price")}>
          <Input
            id="item-price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={values.price}
            onChange={(event) => set("price", event.target.value)}
          />
        </Field>

        <Field label="Category" htmlFor="item-category" error={errorOf("categoryId")}>
          <Select
            id="item-category"
            value={values.categoryId}
            onChange={(event) => set("categoryId", event.target.value)}
          >
            <option value="">Choose…</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Emoji (shown when there is no photo)" htmlFor="item-emoji" error={errorOf("emoji")}>
          <Input
            id="item-emoji"
            value={values.emoji}
            onChange={(event) => set("emoji", event.target.value)}
            maxLength={8}
          />
        </Field>

        <Field label="Photo" error={errorOf("imageUrl")}>
          <ImageUpload imageUrl={values.imageUrl} onChange={(url) => set("imageUrl", url)} />
        </Field>

        <div className={styles.available}>
          <Checkbox
            checked={values.isAvailable}
            onChange={(event) => set("isAvailable", event.target.checked)}
          >
            Available to order
          </Checkbox>
        </div>

        {formError && (
          <p className={styles.message} role="alert">
            {formError}
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" disabled={pending} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save item"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
