import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/session";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

/**
 * Server-side session helpers. Middleware gives a fast redirect for signed-out
 * visitors, but it is a convenience, not the security boundary — every
 * protected page and every mutation calls requireAdmin() below, which is what
 * actually enforces access.
 */

export async function createSession(admin: { id: string; email: string }) {
  const token = await signSessionToken(
    { sub: admin.id, email: admin.email, role: "ADMIN" },
    env.AUTH_SECRET,
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value, env.AUTH_SECRET);
}

export interface CurrentAdmin {
  id: string;
  email: string;
  role: "ADMIN";
}

/**
 * The token is re-checked against the database so that an admin deleted after
 * their cookie was issued loses access immediately, rather than when the
 * token happens to expire.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = await getSession();
  if (!session) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, role: true },
  });

  return admin ? { id: admin.id, email: admin.email, role: "ADMIN" } : null;
}

/** Use at the top of every protected page and mutation. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
