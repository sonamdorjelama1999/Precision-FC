import type { Metadata } from "next";

import { PageHead } from "@/components/layout/page-head";
import { SponsorStrip } from "@/components/layout/sponsor-strip";
import { Wrap } from "@/components/layout/wrap";
import { ScorerTable } from "@/components/players/scorer-table";
import { SquadGroups } from "@/components/players/squad-groups";
import { SectionHead } from "@/components/ui/section-head";
import { getFixtures } from "@/features/fixtures/queries";
import { getPlayers } from "@/features/players/queries";
import { getSponsors, getStaff } from "@/features/team/queries";
import { scorerTable, splitFixtures } from "@/lib/stats";

/**
 * Statically rendered and re-generated on demand: the admin actions call
 * revalidatePath() after every save, and this interval is the safety net in
 * case a revalidation is ever missed.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Squad",
  description: "The Precision FC squad, with goals and assists counted from every logged match.",
};

export default async function SquadPage() {
  const [players, fixtures, staff, sponsors] = await Promise.all([
    getPlayers(),
    getFixtures(),
    getStaff(),
    getSponsors(),
  ]);

  const { played } = splitFixtures(fixtures);
  const scorers = scorerTable(played, players);

  return (
    <>
      <PageHead
        eyebrow="The players"
        title="Squad"
        description="Goals and assists are counted from the match log — add a goal to a fixture and the player's numbers update on their own."
      />

      <section className="py-12 md:py-17">
        <Wrap>
          {players.length === 0 && staff.length === 0 ? (
            <div className="rounded border border-dashed border-line-strong bg-paper-2 p-8 text-ink-2">
              <strong className="mb-1.5 block text-ink">No players yet</strong>
              Add the first one from the admin CMS and it appears here.
            </div>
          ) : (
            <SquadGroups players={players} scorers={scorers} staff={staff} />
          )}
        </Wrap>
      </section>

      <section className="bg-navy-800 py-12 md:py-14">
        <Wrap>
          <SectionHead
            onDark
            eyebrow="Leaderboard"
            title="Goal contributions"
            description="Anyone credited with a goal or an assist in the match log appears here."
            link={{ href: "/fixtures", label: "See the matches" }}
          />
          <ScorerTable rows={scorers} onDark showContributions />
        </Wrap>
      </section>

      <SponsorStrip sponsors={sponsors} />
    </>
  );
}
