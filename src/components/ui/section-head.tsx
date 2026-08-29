import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export function SectionHead({
  eyebrow,
  title,
  description,
  link,
  onDark = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  onDark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        <h2
          className={cn(
            "text-[clamp(26px,3.4vw,38px)] font-black uppercase tracking-[-0.025em]",
            onDark && "text-white",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-2 max-w-[52ch]", onDark ? "text-white/70" : "text-ink-2")}>
            {description}
          </p>
        ) : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className={cn(
            "border-b-2 border-lime pb-0.5 font-display text-[13px] font-bold uppercase tracking-[0.07em] whitespace-nowrap transition-colors",
            onDark ? "text-teal hover:text-white" : "text-teal-dark hover:text-ink",
          )}
        >
          {link.label}
        </Link>
      ) : null}
      {children}
    </div>
  );
}
