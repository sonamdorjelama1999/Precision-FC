import type { Metadata } from "next";

import { Wrap } from "@/components/layout/wrap";
import { SquadGroups } from "@/components/players/squad-groups";
import { getPlayers } from "@/features/players/queries";
import { getStaff } from "@/features/team/queries";

/**
 * Statically rendered and re-generated on demand: the admin actions call
 * revalidatePath() after every save, and this interval is the safety net in
 * case a revalidation is ever missed.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Squad",
  description: "The Precision FC squad — every player, by position.",
};

export default async function SquadPage() {
  const [players, staff] = await Promise.all([getPlayers(), getStaff()]);

  return (
    <section className="py-12 md:py-17">
      <Wrap>
        {players.length === 0 && staff.length === 0 ? (
          <div className="rounded border border-dashed border-line-strong bg-paper-2 p-8 text-ink-2">
            <strong className="mb-1.5 block text-ink">No players yet</strong>
            Add the first one from the admin CMS and it appears here.
          </div>
        ) : (
          <SquadGroups players={players} staff={staff} />
        )}
      </Wrap>
    </section>
  );
}
