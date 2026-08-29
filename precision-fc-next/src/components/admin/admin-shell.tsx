"use client";

import { Handshake, LayoutDashboard, LogOut, Menu, UserCog, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, group: null },
  { href: "/admin/players", label: "Players", icon: Users, exact: false, group: "Team" },
  { href: "/admin/staff", label: "Staff", icon: UserCog, exact: false, group: "Team" },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake, exact: false, group: "Team" },
];

/**
 * Admin chrome: a fixed sidebar on desktop, a slide-down drawer on mobile.
 * Client component only for the drawer state and the active-link highlight.
 */
export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[260px_1fr]">
      {/* mobile bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-navy-900 px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="rounded-md border border-white/25 p-2 text-white"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside
        className={cn(
          "flex-col justify-between bg-navy-900 p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh",
          open ? "flex" : "hidden",
        )}
      >
        <div>
          <div className="mb-8 hidden lg:block">
            <Brand />
          </div>
          <nav className="space-y-1">
            {NAV.map((item, index) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const startsGroup = item.group && item.group !== NAV[index - 1]?.group;
              return (
                <div key={item.href}>
                  {startsGroup ? (
                    <p className="mt-6 mb-2 px-3 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/35">
                      {item.group}
                    </p>
                  ) : null}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] transition-colors",
                      active
                        ? "bg-lime text-navy-900"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="mb-3 truncate font-mono text-[11px] tracking-[0.08em] text-white/50">
            {email}
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              View public site
            </Link>
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start px-3 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 text-white">
      <Image src="/crest.png" alt="" width={32} height={34} />
      <span>
        <b className="block font-display text-[15px] leading-none font-extrabold">Precision FC</b>
        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-teal">
          Admin
        </span>
      </span>
    </Link>
  );
}
