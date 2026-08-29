import { cn } from "@/lib/utils";

const LABEL = { W: "Win", D: "Draw", L: "Loss" } as const;

export function FormGuide({ form }: { form: Array<"W" | "D" | "L"> }) {
  if (form.length === 0) {
    return <span className="text-ink-3">No matches yet</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {form.map((result, index) => (
        <span
          key={`${result}-${index}`}
          title={LABEL[result]}
          className={cn(
            "grid size-7 place-items-center rounded-[3px] font-display text-[13px] font-extrabold",
            result === "W" && "bg-lime text-navy-900",
            result === "D" && "bg-ink-3 text-white",
            result === "L" && "bg-loss text-white",
          )}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
