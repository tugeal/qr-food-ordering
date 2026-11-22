const orderTime = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

/** An ISO timestamp as shown on orders, always in Philippine time. */
export function formatOrderTime(iso: string): string {
  return orderTime.format(new Date(iso));
}
