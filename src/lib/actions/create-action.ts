import "server-only";
import type { z } from "zod";
import { fail, type Result } from "./result";

const GENERIC_ERROR = "Something went wrong. Please try again.";

function fieldErrorsOf(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "_form");
    (errors[field] ??= []).push(issue.message);
  }
  return errors;
}

/**
 * Wraps a Server Action: validates the input with Zod, runs the handler, and never leaks raw
 * errors to the browser. Later phases extend it with an admin check.
 */
export function createAction<TSchema extends z.ZodType, TData>(
  schema: TSchema,
  handler: (input: z.output<TSchema>) => Promise<Result<TData>>,
) {
  return async (input: unknown): Promise<Result<TData>> => {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return fail("Please check the highlighted fields.", fieldErrorsOf(parsed.error.issues));
    }

    try {
      return await handler(parsed.data);
    } catch (error) {
      console.error("Server action failed:", error);
      return fail(GENERIC_ERROR);
    }
  };
}
