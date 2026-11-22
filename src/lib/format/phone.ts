/** Normalises a Philippine mobile number to 09XXXXXXXXX, or returns null when it isn't one. */
export function normalizePhMobile(raw: string): string | null {
  const compact = raw.replace(/[\s()-]/g, "");
  const match = /^(?:\+?63|0)(9\d{9})$/.exec(compact);
  return match ? `0${match[1]}` : null;
}
