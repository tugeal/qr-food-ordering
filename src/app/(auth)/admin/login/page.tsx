import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { LoginForm } from "@/features/auth/components/login-form";
import { getRestaurantName } from "@/features/settings/queries";
import { getAdminUser } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin/orders");

  const name = await getRestaurantName();

  return (
    <PageShell size="narrow">
      <SiteHeader title={name} subtitle="Admin sign-in" />
      <LoginForm />
    </PageShell>
  );
}
