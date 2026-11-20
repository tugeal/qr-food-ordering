const amount = new Intl.NumberFormat("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** 149 -> "₱149", 149.5 -> "₱149.5", 1234.56 -> "₱1,234.56" */
export function formatPeso(value: number): string {
  return `₱${amount.format(value)}`;
}
