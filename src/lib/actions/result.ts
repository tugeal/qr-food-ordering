/** What every Server Action returns: a value, or a message the UI can show. */
export type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });

export const fail = (error: string, fieldErrors?: Record<string, string[]>): Result<never> => ({
  ok: false,
  error,
  fieldErrors,
});
