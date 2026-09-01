import Link from "next/link";

import { Wrap } from "@/components/layout/wrap";
import { CLUB } from "@/data/club";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/news", label: "News" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/about", label: "The club" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-900 pt-13 pb-8 text-sm text-white/60">
      <Wrap>
        <div className="grid gap-9 border-b border-white/10 pb-7 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <FooterHeading>{CLUB.name}</FooterHeading>
            <p className="mt-3 max-w-[40ch]">
              The futsal club from Kathmandu, founded in {CLUB.founded}. Built to attack.
            </p>
          </div>
          <div>
            <FooterHeading>Pages</FooterHeading>
            <ul>
              {PAGES.map((page) => (
                <li key={page.href} className="mb-2">
                  <Link href={page.href} className="text-white/70 transition-colors hover:text-lime">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <FooterHeading>Where we play</FooterHeading>
            <ul>
              <li className="mb-2">{CLUB.ground}</li>
              <li className="mb-2">{CLUB.city}</li>
              <li className="mb-2">
                <a
                  href={`mailto:${CLUB.email}`}
                  className="text-white/70 transition-colors hover:text-lime"
                >
                  {CLUB.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-[22px] font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
          <span>&copy; {new Date().getFullYear()} {CLUB.name}</span>
          <span>Est. {CLUB.founded}</span>
        </div>
      </Wrap>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-teal">
      {children}
    </h4>
  );
}
