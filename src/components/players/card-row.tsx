"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * One position group on a single row.
 *
 * Cards keep their fixed 350px width no matter how many players are in the
 * group, so the row scrolls sideways rather than wrapping — eight forwards
 * stay one row, exactly like the reference. Arrow buttons appear only when
 * there is actually something to scroll to, and only where a pointer exists;
 * touch devices just swipe.
 */
export function CardRow({ children }: { children: React.ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    measure();
    el.addEventListener("scroll", measure, { passive: true });

    // Card widths are breakpoint-based, so the row can start or stop
    // overflowing on resize alone.
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  function scrollBy(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    // Roughly one card plus its gap.
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 384), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        className={cn(
          "pfc-no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-smooth sm:gap-[34px]",
          // Bleed into the page gutter: on phones both sides, so a half-card
          // shows at the screen edge; from sm up only the right, which keeps
          // the first card aligned with the heading while giving the row the
          // full container width — three 350px cards then fit without the
          // 6px overflow the gutters would otherwise cause.
          "-mx-[18px] px-[18px] pb-1 sm:mr-[-24px] sm:ml-0 sm:pr-0 sm:pl-0",
        )}
      >
        {children}
      </div>

      <Arrow side="left" visible={canLeft} onClick={() => scrollBy(-1)} />
      <Arrow side="right" visible={canRight} onClick={() => scrollBy(1)} />
    </div>
  );
}

function Arrow({
  side,
  visible,
  onClick,
}: {
  side: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line",
        "bg-paper-2/95 text-ink shadow-md backdrop-blur-sm transition-opacity",
        "hover:border-navy-800 hover:bg-navy-800 hover:text-white",
        side === "left" ? "-left-3" : "-right-3",
        visible ? "opacity-100 md:grid" : "pointer-events-none opacity-0",
      )}
    >
      {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
  );
}
