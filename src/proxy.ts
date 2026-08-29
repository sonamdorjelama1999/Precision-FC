import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Redirects signed-out visitors away from /admin/* before the page renders,
 * and bounces a signed-in admin off the login page.
 *
 * Next.js 16 renamed this file convention from `middleware` to `proxy`; the
 * behaviour is unchanged, and `config.matcher` still applies.
 *
 * This is a fast path, not the security boundary. It runs on the edge runtime
 * where Prisma is unavailable, so it can only check the token's signature.
 * Every protected page and every mutation independently calls requireAdmin(),
 * which is what actually enforces access.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("[proxy] AUTH_SECRET is not set — refusing admin access.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    secret,
  );

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return session
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (!session) {
    const url = new URL("/admin/login", request.url);
    // Remember where they were headed so login can send them back.
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
