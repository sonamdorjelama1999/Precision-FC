import { DataTable, Td, Th } from "@/components/ui/data-table";
import type { OpponentRow } from "@/types";

export function OpponentTable({ rows }: { rows: OpponentRow[] }) {
  if (rows.length === 0) {
    return <p className="text-white/70">No opponents recorded yet.</p>;
  }

  return (
    <DataTable
      onDark
      head={
        <tr>
          <Th onDark>Opponent</Th>
          {["P", "W", "D", "L", "GF", "GA"].map((label) => (
            <Th key={label} onDark numeric>
              {label}
            </Th>
          ))}
        </tr>
      }
    >
      {rows.map((row) => (
        <tr key={row.name} className="hover:bg-white/5">
          <Td onDark className="font-semibold">
            {row.name}
          </Td>
          <Td onDark numeric>{row.played}</Td>
          <Td onDark numeric>{row.won}</Td>
          <Td onDark numeric>{row.drawn}</Td>
          <Td onDark numeric>{row.lost}</Td>
          <Td onDark numeric>{row.goalsFor}</Td>
          <Td onDark numeric>{row.goalsAgainst}</Td>
        </tr>
      ))}
    </DataTable>
  );
}
