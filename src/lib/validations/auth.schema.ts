import { z } from "zod";

/**
 * Shared between the login form and the server action, so the browser and the
 * server enforce exactly the same rules and neither can drift.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email address."))
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;
