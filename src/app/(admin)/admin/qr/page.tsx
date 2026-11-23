import type { Metadata } from "next";
import { QrPanel } from "@/features/settings/components/qr-panel";
import { RestaurantForm } from "@/features/settings/components/restaurant-form";
import { getMenuUrl, getRestaurantName, getSiteUrlSetting } from "@/features/settings/queries";
import { requireAdmin } from "@/lib/auth/admin";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "QR code" };

export default async function QrPage() {
  await requireAdmin();
  const [name, menuUrl, siteUrl] = await Promise.all([
    getRestaurantName(),
    getMenuUrl(),
    getSiteUrlSetting(),
  ]);

  return (
    <div className={styles.page}>
      <QrPanel menuUrl={menuUrl} />
      <RestaurantForm restaurantName={name} siteUrl={siteUrl} />
    </div>
  );
}
