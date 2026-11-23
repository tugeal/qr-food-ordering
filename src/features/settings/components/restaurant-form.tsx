"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { saveSettings } from "../actions";
import styles from "./restaurant-form.module.css";

type Props = { restaurantName: string; siteUrl: string };

export function RestaurantForm({ restaurantName, siteUrl }: Props) {
  const router = useRouter();
  const [name, setName] = useState(restaurantName);
  const [url, setUrl] = useState(siteUrl);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ kind: "saved" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage(null);

    startTransition(async () => {
      const result = await saveSettings({ restaurantName: name, siteUrl: url });
      if (result.ok) {
        setUrl(result.data.siteUrl);
        setMessage({ kind: "saved", text: "Saved" });
        router.refresh();
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setMessage({ kind: "error", text: result.error });
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card>
        <h2 className={styles.title}>Restaurant details</h2>

        <Field label="Restaurant name" htmlFor="restaurantName" error={errors.restaurantName?.[0]}>
          <Input
            id="restaurantName"
            name="restaurantName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={50}
          />
        </Field>

        <Field label="Menu link in the QR code" htmlFor="siteUrl" error={errors.siteUrl?.[0]}>
          <Input
            id="siteUrl"
            name="siteUrl"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://menu.yourdomain.com"
            maxLength={300}
          />
        </Field>
        <p className={styles.help}>
          Leave it empty to use the address from your environment settings.
        </p>

        <div className={styles.actions}>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          {message && (
            <span
              className={message.kind === "error" ? styles.error : styles.saved}
              role={message.kind === "error" ? "alert" : "status"}
            >
              {message.text}
            </span>
          )}
        </div>
      </Card>
    </form>
  );
}
