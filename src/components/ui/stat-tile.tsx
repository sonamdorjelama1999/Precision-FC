import { cn } from "@/lib/utils";

export function StatTile({
  value,
  label,
  onDark = false,
}: {
  value: string | number;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded border border-t-[3px] px-5 pt-5 pb-[18px]",
        onDark
          ? "border-white/10 border-t-lime bg-navy-700 text-white"
          : "border-line border-t-teal bg-paper-2 text-ink",
      )}
    >
      <b className="block font-mono text-[clamp(30px,4.6vw,42px)] leading-none font-semibold tracking-[-0.03em] tabular-nums">
        {value}
      </b>
      <span
        className={cn(
          "mt-[9px] block font-mono text-[10.5px] uppercase tracking-[0.15em]",
          onDark ? "text-white/60" : "text-ink-3",
        )}
      >
        {label}
      </span>
    </div>
  );
}
