"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "../actions";
import styles from "./login-form.module.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);

    startTransition(async () => {
      const result = await signIn({ email, password });
      if (result.ok) {
        router.replace(result.data.redirectTo);
        router.refresh();
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error);
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card>
        <h2 className={styles.title}>Sign in</h2>

        <Field label="Email" htmlFor="email" error={errors.email?.[0]}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password?.[0]}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        {formError && (
          <p className={styles.message} role="alert">
            {formError}
          </p>
        )}

        <div className={styles.actions}>
          <Button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
