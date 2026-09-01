"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Team } from "@/types";

/**
 * The home/away pickers on the match form — a thin wrapper around the shared
 * Select rather than a new primitive, following the same pattern the player
 * and team forms already use for their own dropdowns.
 */
export function TeamSelect({
  id,
  teams,
  value,
  onValueChange,
  placeholder = "Select a team",
  disabledId,
}: {
  id?: string;
  teams: Pick<Team, "id" | "name" | "isPrimary">[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** Greys out one option — keeps the away picker from also picking the home team. */
  disabledId?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id} disabled={team.id === disabledId}>
            {team.name}
            {team.isPrimary ? " (home)" : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
