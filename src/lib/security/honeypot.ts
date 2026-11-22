import { z } from "zod";

/** A hidden form field that people leave empty and simple bots fill in. */
export const HONEYPOT_FIELD = "website";

export const honeypotSchema = z.string().max(0, "Invalid submission.").default("");
