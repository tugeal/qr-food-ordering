"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "../actions";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOut({});
          router.replace("/admin/login");
          router.refresh();
        })
      }
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
