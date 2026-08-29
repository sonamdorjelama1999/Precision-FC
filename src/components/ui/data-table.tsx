import { cn } from "@/lib/utils";

/**
 * The public site's data table. Wide tables scroll inside their own container
 * rather than pushing the page sideways — the rule the static CSS enforced
 * with .table-scroll.
 */
export function DataTable({
  head,
  children,
  onDark = false,
}: {
  head: React.ReactNode;
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto">
      <table
        className={cn(
          "w-full min-w-[560px] table-auto border-collapse rounded border",
          onDark ? "border-white/10 bg-navy-700 text-white" : "border-line bg-paper-2 text-ink",
        )}
      >
        <thead>{head}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({
  children,
  numeric = false,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  numeric?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "border-b px-3.5 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] whitespace-nowrap",
        numeric ? "text-right" : "text-left",
        onDark ? "border-white/10 bg-white/5 text-white/60" : "border-line bg-[#f7f9f9] text-ink-3",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  numeric = false,
  onDark = false,
  className,
}: {
  children: React.ReactNode;
  numeric?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b px-3.5 py-3 text-[14.5px] last:border-b-0",
        numeric ? "text-right font-mono tabular-nums" : "text-left",
        onDark ? "border-white/10" : "border-line",
        className,
      )}
    >
      {children}
    </td>
  );
}
