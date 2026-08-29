"use server";

import { redirect } from "next/navigation";

import { createSession, destroySession } from "@/features/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth.schema";

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Login.
 *
 * The same "Invalid email or password" message is returned whether the email
 * is unknown or the password is wrong — telling them apart would let anyone
 * enumerate which addresses have accounts. A dummy hash comparison runs on the
 * unknown-email path so both cases take the same time.
 */
export async function login(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Check the form and try again.", fieldErrors };
  }

  const { email, password } = parsed.data;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    const valid = admin
      ? await verifyPassword(password, admin.password)
      : await verifyPassword(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin");

    if (!admin || !valid) {
      return { ok: false, message: "Invalid email or password." };
    }

    await createSession(admin);
    return { ok: true };
  } catch (error) {
    console.error("[auth] login failed:", error);
    return { ok: false, message: "Could not sign you in. Please try again." };
  }
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
