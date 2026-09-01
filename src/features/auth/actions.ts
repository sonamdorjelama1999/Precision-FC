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

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
/** Same shape as a real bcrypt hash so a compare against it takes the same time as a real one. */
const DUMMY_HASH = "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";

/**
 * Login.
 *
 * Two defenses layer on top of each other:
 *  - The same "Invalid email or password" message comes back whether the
 *    email is unknown or the password is wrong, and a dummy hash comparison
 *    runs on the unknown-email path so both cases take the same time —
 *    telling them apart would let anyone enumerate which addresses have
 *    accounts.
 *  - `failedAttempts`/`lockedUntil` on Admin throttle repeated guessing:
 *    five wrong passwords lock the account for 15 minutes, reset by one
 *    correct login. This lives on the row being protected rather than a
 *    general-purpose rate-limit table, since login is the only thing here
 *    that needs it. Once an account is locked, that state is disclosed (a
 *    distinct message rather than the generic one) — the alternative is a
 *    locked-out admin with no idea why their real password stopped working.
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

    if (admin?.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
      return { ok: false, message: "Too many failed attempts. Try again in a few minutes." };
    }

    const valid = admin
      ? await verifyPassword(password, admin.password)
      : await verifyPassword(password, DUMMY_HASH);

    if (!admin || !valid) {
      if (admin) await recordFailedAttempt(admin.id, admin.failedAttempts);
      return { ok: false, message: "Invalid email or password." };
    }

    if (admin.failedAttempts > 0 || admin.lockedUntil) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { failedAttempts: 0, lockedUntil: null },
      });
    }

    await createSession(admin);
    return { ok: true };
  } catch (error) {
    console.error("[auth] login failed:", error);
    return { ok: false, message: "Could not sign you in. Please try again." };
  }
}

async function recordFailedAttempt(adminId: string, attemptsBeforeThis: number) {
  const attempts = attemptsBeforeThis + 1;
  await prisma.admin.update({
    where: { id: adminId },
    data: {
      failedAttempts: { increment: 1 },
      ...(attempts >= MAX_ATTEMPTS
        ? { lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60_000) }
        : {}),
    },
  });
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
