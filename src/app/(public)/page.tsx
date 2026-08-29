import Image from "next/image";
import Link from "next/link";

import { Wrap } from "@/components/layout/wrap";
import { FormGuide } from "@/components/matches/form-guide";
import { MatchList } from "@/components/matches/match-list";
import { NextMatch } from "@/components/matches/next-match";
import { ScorerTable } from "@/components/players/scorer-table";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHead } from "@/components/ui/section-head";
import { StatTile } from "@/components/ui/stat-tile";
import { CLUB } from "@/data/club";
import { getFixtures } from "@/features/fixtures/queries";
import { getPlayers } from "@/features/players/queries";
import { signed } from "@/lib/format";
import { recentForm, scorerTable, seasonTotals, splitFixtures } from "@/lib/stats";

/**
 * Statically rendered and re-generated on demand: the admin actions call
 * revalidatePath() after every save, and this interval is the safety net in
 * case a revalidation is ever missed.
 */
export const revalidate = 300;

export default async function HomePage() {
  const [fixtures, players] = await Promise.all([getFixtures(), getPlayers()]);
  const { played, upcoming } = splitFixtures(fixtures);
  const totals = seasonTotals(played);
  const scorers = scorerTable(played, players);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-navy-900 pt-14 pb-13 text-white md:pt-[84px] md:pb-[76px]">
        <div className="pfc-hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="pfc-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <Wrap className="relative z-10">
          <div className="grid items-center gap-9 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
            <div className="max-lg:order-2">
              <Eyebrow onDark>Futsal &middot; Kathmandu &middot; Since {CLUB.founded}</Eyebrow>
              <h1 className="mb-5 text-[clamp(46px,8.4vw,104px)] font-black uppercase tracking-[-0.035em]">
                Precision
                <em className="block not-italic text-lime">FC</em>
              </h1>
              <p className="mb-7 max-w-[46ch] text-[clamp(16px,1.6vw,19px)] text-white/80">
                Movement, angles and finishing. Every match the club plays is logged goal by goal —
                the record on this site is built straight from it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/fixtures"
                  className="inline-flex items-center gap-2.5 rounded-[3px] border-2 border-lime bg-lime px-[22px] py-[13px] font-display text-sm font-bold uppercase tracking-[0.06em] text-navy-900 transition hover:-translate-y-px hover:border-lime-dark hover:bg-lime-dark"
                >
                  Fixtures &amp; results
                </Link>
                <Link
                  href="/squad"
                  className="inline-flex items-center gap-2.5 rounded-[3px] border-2 border-white/35 px-[22px] py-[13px] font-display text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:-translate-y-px hover:border-white hover:bg-white hover:text-navy-900"
                >
                  Meet the squad
                </Link>
              </div>
            </div>
            <div className="justify-self-start drop-shadow-[0_26px_60px_rgba(0,0,0,0.55)] max-lg:order-1 lg:justify-self-center">
              <Image
                src="/crest.png"
                alt="Precision FC club crest"
                width={320}
                height={337}
                priority
                className="w-[min(200px,46vw)] lg:w-[min(320px,68vw)]"
              />
            </div>
          </div>

          <dl className="relative z-10 mt-13 flex flex-wrap border-t border-white/15">
            <HeroFact label="Founded" value={String(CLUB.founded)} />
            <HeroFact label="Home ground" value={CLUB.ground} />
            <HeroFact label="Based in" value={CLUB.city} />
            <HeroFact label="The rivalry" value="El Clasico" />
          </dl>
        </Wrap>
      </section>

      {/* next fixture + form */}
      <section className="py-12">
        <Wrap>
          <div className="grid gap-9 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
            <NextMatch fixture={upcoming[0] ?? null} />
            <div className="rounded border border-line bg-paper-2 p-[22px]">
              <Eyebrow>Recent form</Eyebrow>
              <FormGuide form={recentForm(played)} />
              <p className="mt-4 text-[14.5px] text-ink-2">
                Last five results, oldest first. Green is a win, red a loss.
              </p>
            </div>
          </div>
        </Wrap>
      </section>

      {/* season numbers */}
      <section className="bg-navy-800 py-12 md:py-17">
        <Wrap>
          <SectionHead
            onDark
            eyebrow="By the numbers"
            title="The record so far"
            description="Counted from every logged match — nothing here is typed in by hand."
            link={{ href: "/fixtures", label: "Full breakdown" }}
          />
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <StatTile onDark value={totals.played} label="Matches played" />
            <StatTile onDark value={totals.won} label="Wins" />
            <StatTile onDark value={totals.goalsFor} label="Goals scored" />
            <StatTile onDark value={signed(totals.goalDifference)} label="Goal difference" />
          </div>
        </Wrap>
      </section>

      {/* recent results */}
      <section className="py-12 md:py-17">
        <Wrap>
          <SectionHead
            eyebrow="Latest"
            title="Recent results"
            description="Tap a match to open the goal timeline."
            link={{ href: "/fixtures", label: "All results" }}
          />
          <MatchList
            fixtures={played.slice(-3).reverse()}
            emptyMessage="No results recorded yet."
          />
        </Wrap>
      </section>

      {/* scorers */}
      <section className="pb-12 md:pb-17">
        <Wrap>
          <div className="grid gap-9 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
            <div>
              <Eyebrow>Leaderboard</Eyebrow>
              <h2 className="mb-[18px] text-[clamp(24px,3vw,32px)] font-black uppercase">
                Top scorers
              </h2>
              <ScorerTable rows={scorers} limit={5} />
            </div>
            <div className="rounded border border-line bg-paper-2 p-[22px]">
              <Eyebrow>El Clasico</Eyebrow>
              <h3 className="mb-2.5 text-[22px] font-extrabold uppercase">
                Precision v {CLUB.rival}
              </h3>
              <p className="text-[15px] text-ink-2">
                The one fixture on the calendar with its own name. Formerly Yangrima FC, played out
                at {CLUB.ground} — and the meeting the season tends to get judged on.
              </p>
              <p className="mt-4">
                <Link
                  href="/about"
                  className="border-b-2 border-lime pb-0.5 font-display text-[13px] font-bold uppercase tracking-[0.07em] text-teal-dark transition-colors hover:text-ink"
                >
                  Read the club story
                </Link>
              </p>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}

function HeroFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-[1_1_150px] pt-5 pr-[22px] pb-1">
      <dt className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-teal">
        {label}
      </dt>
      <dd className="font-display text-[18px] font-bold tracking-[-0.01em]">{value}</dd>
    </div>
  );
}
