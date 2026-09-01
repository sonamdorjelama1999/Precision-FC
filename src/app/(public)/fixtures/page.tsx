import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { FixturesTabs } from "@/components/matches/fixtures-tabs";
import { NextMatch } from "@/components/matches/next-match";
import {
  getPublicNextMatch,
  getPublicResults,
  getPublicUpcomingMatches,
} from "@/features/matches/queries";
import { pageMetadata } from "@/lib/seo";

/**
 * Statically rendered and re-generated on demand: the admin match actions
 * call revalidatePath("/fixtures") after every save, and this interval is
 * the safety net in case a revalidation is ever missed — same pattern as the
 * squad and about pages.
 */
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Fixtures",
  description: "Precision FC's upcoming fixtures and recent results.",
  path: "/fixtures",
});

export default async function FixturesPage() {
  const [nextMatch, upcoming, results] = await Promise.all([
    getPublicNextMatch(),
    getPublicUpcomingMatches(),
    getPublicResults(),
  ]);

  // The Next Match card already leads with the soonest fixture — no need to
  // repeat it at the top of the Upcoming list below.
  const restUpcoming = nextMatch ? upcoming.filter((match) => match.id !== nextMatch.id) : upcoming;

  return (
    <>
      <PageHead
        eyebrow="Matchday"
        title="Fixtures"
        description="Every published match for Precision FC and its opponents — scheduled and played."
      />

      <section className="py-12 md:py-17">
        <Wrap className="space-y-10">
          <NextMatch match={nextMatch} />
          <FixturesTabs upcoming={restUpcoming} results={results} />
        </Wrap>
      </section>
    </>
  );
}
