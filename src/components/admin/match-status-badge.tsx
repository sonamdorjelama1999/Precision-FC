import { Badge } from "@/components/ui/badge";
import { FIXTURE_STATUS_LABEL, type FixtureStatus } from "@/types";

const VARIANT: Record<FixtureStatus, "default" | "outline" | "lime"> = {
  SCHEDULED: "outline",
  LIVE: "lime",
  COMPLETED: "default",
  POSTPONED: "outline",
  CANCELLED: "outline",
};

export function MatchStatusBadge({ status }: { status: FixtureStatus }) {
  return <Badge variant={VARIANT[status]}>{FIXTURE_STATUS_LABEL[status]}</Badge>;
}
