import { cn } from "@/lib/utils";

/**
 * The small mono label with a lime rule before it that opens every section.
 * `onDark` switches to the brighter pairing used on navy backgrounds.
 */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-3.5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em]",
        onDark ? "text-teal" : "text-teal-dark",
        className,
      )}
    >
      <span className={cn("h-0.5 w-[22px] shrink-0", onDark ? "bg-lime" : "bg-lime-dark")} />
      {children}
    </p>
  );
}
