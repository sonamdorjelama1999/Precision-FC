import { jwtVerify, SignJWT } from "jose";

/**
 * Sessions are a signed JWT in an httpOnly cookie.
 *
 * Nothing sensitive is stored in the token — only the admin's id, email and
 * role — and it is signed, so the browser can read it but cannot forge one.
 * It is never written to localStorage, so no script on the page can reach it.
 *
 * This module deliberately avoids importing next/headers or Prisma so that
 * middleware (edge runtime) can use verifySessionToken. The cookie helpers
 * that do need next/headers live in features/auth/session.ts.
 */

export const SESSION_COOKIE = "pfc_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string;
  email: string;
  role: "ADMIN";
}

function secretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey(secret));
}

/** Returns the payload, or null for anything invalid, expired or forged. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(secret), {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: "ADMIN",
    };
  } catch {
    return null;
  }
}
