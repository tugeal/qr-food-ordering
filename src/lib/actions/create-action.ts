import "server-only";
import type { z } from "zod";
import { getAdminUser } from "@/lib/auth/admin";
import { fail, type Result } from "./result";

const GENERIC_ERROR = "Something went wrong. Please try again.";

type Options = {
  /** Only a signed-in admin may run this action. Checked before the input is even read. */
  admin?: boolean;
};

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
 * Wraps a Server Action: checks the admin role when asked, validates the input with Zod, runs the
 * handler, and never leaks raw errors to the browser.
 */
export function createAction<TSchema extends z.ZodType, TData>(
  schema: TSchema,
  handler: (input: z.output<TSchema>) => Promise<Result<TData>>,
  options: Options = {},
) {
  return async (input: unknown): Promise<Result<TData>> => {
    if (options.admin && !(await getAdminUser())) {
      return fail("Please sign in again.");
    }

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
