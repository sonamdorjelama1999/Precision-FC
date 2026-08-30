import { RosterCard } from "@/components/players/roster-card";
import type { StaffMember } from "@/types";

/**
 * Same tile as a player, without a shirt number — the manager and coaches sit
 * in the squad grid rather than in a separate list, as they do on a club site.
 */
export function StaffCard({ member }: { member: StaffMember }) {
  return <RosterCard name={member.name} photoUrl={member.photoUrl} subtitle={member.role} />;
}
