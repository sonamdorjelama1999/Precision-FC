"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Wrap } from "@/components/layout/wrap";
import { CLUB } from "@/data/club";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/about", label: "Club" },
];

/**
 * Client component purely for the mobile menu toggle and the active-link
 * highlight — the same two jobs the old site.js did for the header.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900">
      <Wrap className="relative flex min-h-[68px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3 text-white">
          <Image src="/crest.png" alt="" width={38} height={40} className="w-[38px]" priority />
          <span className="block">
            <b className="block font-display text-[17px] leading-none font-extrabold tracking-[-0.01em]">
              {CLUB.name}
            </b>
            <span className="mt-[3px] block font-mono text-[9.5px] uppercase tracking-[0.2em] text-teal">
              Est. {CLUB.founded} &middot; Kathmandu
            </span>
          </span>
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
          className="rounded border border-white/30 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.1em] text-white md:hidden"
        >
          Menu
        </button>

        <nav
          id="site-nav"
          aria-label="Main"
          className={cn(
            "items-center gap-1",
            "max-md:absolute max-md:top-full max-md:right-0 max-md:left-0 max-md:flex-col max-md:items-stretch max-md:gap-0.5 max-md:border-b max-md:border-white/10 max-md:bg-navy-900 max-md:px-4 max-md:pt-2 max-md:pb-4",
            open ? "flex" : "hidden md:flex",
          )}
        >
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded px-3.5 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.08em] transition-colors max-md:px-2 max-md:py-3 max-md:text-[15px]",
                  active ? "text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white",
                  active &&
                    "after:absolute after:bottom-1 after:left-3.5 after:h-0.5 after:bg-lime after:content-[''] md:after:right-3.5 max-md:after:bottom-1.5 max-md:after:left-2 max-md:after:w-[22px]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Wrap>
    </header>
  );
}
