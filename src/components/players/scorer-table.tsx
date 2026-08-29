import { DataTable, Td, Th } from "@/components/ui/data-table";
import type { ScorerRow } from "@/types";

export function ScorerTable({
  rows,
  onDark = false,
  showContributions = false,
  limit,
}: {
  rows: ScorerRow[];
  onDark?: boolean;
  showContributions?: boolean;
  limit?: number;
}) {
  const visible = (limit ? rows.slice(0, limit) : rows).filter(
    (row) => row.goals > 0 || row.assists > 0,
  );

  if (visible.length === 0) {
    return <p className={onDark ? "text-white/70" : "text-ink-2"}>No goal contributions recorded yet.</p>;
  }

  return (
    <DataTable
      onDark={onDark}
      head={
        <tr>
          <Th onDark={onDark} className="w-11">
            #
          </Th>
          <Th onDark={onDark}>Player</Th>
          <Th onDark={onDark} numeric>
            Goals
          </Th>
          <Th onDark={onDark} numeric>
            Assists
          </Th>
          {showContributions ? (
            <Th onDark={onDark} numeric>
              Contributions
            </Th>
          ) : null}
        </tr>
      }
    >
      {visible.map((row, index) => (
        <tr key={row.name} className={onDark ? "hover:bg-white/5" : "hover:bg-[#f7f9f9]"}>
          <Td onDark={onDark} className={onDark ? "font-mono text-white/45" : "font-mono text-ink-3"}>
            {index + 1}
          </Td>
          <Td onDark={onDark} className="font-semibold">
            {row.name}
          </Td>
          <Td onDark={onDark} numeric>
            {row.goals}
          </Td>
          <Td onDark={onDark} numeric>
            {row.assists}
          </Td>
          {showContributions ? (
            <Td onDark={onDark} numeric>
              {row.goals + row.assists}
            </Td>
          ) : null}
        </tr>
      ))}
    </DataTable>
  );
}
