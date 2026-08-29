import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/features/auth/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Precision FC Admin" },
  robots: { index: false, follow: false },
};

/**
 * The auth gate for everything in this group.
 *
 * Middleware already redirects signed-out visitors, but this check is the one
 * that matters: it runs on the server, hits the database, and cannot be
 * skipped by manipulating a cookie or a request header.
 *
 * force-dynamic because every page here depends on the session cookie and
 * must never be served from a static cache.
 */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
