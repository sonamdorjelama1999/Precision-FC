import "server-only";

import bcrypt from "bcryptjs";

/**
 * bcrypt at cost 12 — slow enough to make offline cracking expensive, fast
 * enough that a login still feels instant. bcryptjs is pure JavaScript, so it
 * needs no native build step on Windows or on Vercel.
 *
 * This runs on the Node runtime only; bcrypt cannot run in edge middleware,
 * which is why middleware verifies the signed session token instead.
 */
const COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
