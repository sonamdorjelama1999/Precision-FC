import type { Metadata } from "next";

import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { FormGuide } from "@/components/matches/form-guide";
import { MatchList } from "@/components/matches/match-list";
import { OpponentTable } from "@/components/matches/opponent-table";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHead } from "@/components/ui/section-head";
import { StatTile } from "@/components/ui/stat-tile";
import { getFixtures } from "@/features/fixtures/queries";
import { signed } from "@/lib/format";
import { opponentTable, recentForm, seasonTotals, splitFixtures } from "@/lib/stats";

/**
 * Statically rendered and re-generated on demand: the admin actions call
 * revalidatePath() after every save, and this interval is the safety net in
 * case a revalidation is ever missed.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fixtures & Results",
  description:
    "Every Precision FC fixture and result, with goal timelines, season totals and a record against each opponent.",
};

export default async function FixturesPage() {
  const fixtures = await getFixtures();
  const { played, upcoming } = splitFixtures(fixtures);
  const totals = seasonTotals(played);

  return (
    <>
      <PageHead
        eyebrow="Match record"
        title="Fixtures & results"
        description="Every match logged, goal by goal. Open any result to see when the goals went in and who scored them."
      />

      <section className="py-12">
        <Wrap>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <Eyebrow>Season totals</Eyebrow>
              <h2 className="text-[clamp(24px,3vw,32px)] font-black uppercase">Summary</h2>
            </div>
            <FormGuide form={recentForm(played)} />
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <StatTile value={totals.played} label="Played" />
            <StatTile value={totals.won} label="Won" />
            <StatTile value={totals.drawn} label="Drawn" />
            <StatTile value={totals.lost} label="Lost" />
            <StatTile value={totals.goalsFor} label="For" />
            <StatTile value={totals.goalsAgainst} label="Against" />
            <StatTile value={signed(totals.goalDifference)} label="Difference" />
            <StatTile value={`${totals.winPct}%`} label="Win rate" />
          </div>
        </Wrap>
      </section>

      <section className="pb-12 md:pb-17">
        <Wrap>
          <SectionHead eyebrow="Scheduled" title="Upcoming" />
          <MatchList
            fixtures={upcoming}
            emptyMessage="No fixtures scheduled."
          />
        </Wrap>
      </section>

      <section className="pb-12 md:pb-17">
        <Wrap>
          <SectionHead eyebrow="Played" title="Results" description="Most recent first." />
          <MatchList fixtures={[...played].reverse()} emptyMessage="No results recorded yet." />
        </Wrap>
      </section>

      <section className="bg-navy-800 py-12 md:py-17">
        <Wrap>
          <SectionHead
            onDark
            eyebrow="Head to head"
            title="Record by opponent"
            description="How the club has fared against each side it has faced."
          />
          <OpponentTable rows={opponentTable(played)} />
        </Wrap>
      </section>
    </>
  );
}
