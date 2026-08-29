import type { Metadata } from "next";
import Image from "next/image";

import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHead } from "@/components/ui/section-head";
import { CLUB, STORY } from "@/data/club";
import { getFixtures } from "@/features/fixtures/queries";
import { seasonTotals, splitFixtures } from "@/lib/stats";

/**
 * Statically rendered and re-generated on demand: the admin actions call
 * revalidatePath() after every save, and this interval is the safety net in
 * case a revalidation is ever missed.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Club",
  description:
    "The story of Precision FC: founded 2019, based at Rumble Futsal in Kathmandu, and the El Clasico rivalry with Ama Yangri FC.",
};

const STEPS = [
  {
    title: "1 · Open the CMS",
    body: "Sign in at /admin. Players, numbers, positions and photos all live there.",
  },
  {
    title: "2 · Add the match",
    body: "Log the fixture with its date and opponent, then each goal with its minute and scorer.",
  },
  {
    title: "3 · Done",
    body: "Scorelines, form, season totals, head-to-head and the scorer table all recalculate on their own.",
  },
];

export default async function AboutPage() {
  const fixtures = await getFixtures();
  const { played } = splitFixtures(fixtures);
  const totals = seasonTotals(played);

  const facts: Array<[string, string]> = [
    ["Founded", String(CLUB.founded)],
    ["Sport", CLUB.sport],
    ["Home", CLUB.ground],
    ["Based in", CLUB.city],
    ["Rivalry", `El Clasico v ${CLUB.rival}`],
    ["Matches logged", String(totals.played)],
    ["Record", `${totals.won}W ${totals.drawn}D ${totals.lost}L`],
    ["Goals for / against", `${totals.goalsFor} / ${totals.goalsAgainst}`],
  ];

  return (
    <>
      <PageHead
        eyebrow={`Since ${CLUB.founded}`}
        title="The club"
        description="Who Precision FC are, where the club plays, and the fixture the season gets measured by."
      />

      <section className="py-12 md:py-17">
        <Wrap>
          <div className="grid gap-9 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
            <div className="max-w-[68ch]">
              {STORY.map((block) => (
                <div key={block.heading}>
                  <h3 className="mt-8 mb-2.5 text-[21px] uppercase tracking-[-0.015em] first:mt-0">
                    {block.heading}
                  </h3>
                  <p className="mb-4 text-[16.5px] text-ink-2">{block.body}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="rounded border border-line bg-paper-2 p-[22px]">
                <Eyebrow>At a glance</Eyebrow>
                <ul>
                  {facts.map(([label, value]) => (
                    <li
                      key={label}
                      className="flex justify-between gap-4 border-b border-line py-3 text-[14.5px] last:border-b-0"
                    >
                      <span className="pt-[3px] font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                        {label}
                      </span>
                      <b className="text-right font-semibold">{value}</b>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded border border-line bg-paper-2 p-[22px]">
                <Eyebrow>Crest</Eyebrow>
                <Image
                  src="/crest.png"
                  alt="Precision FC club crest"
                  width={190}
                  height={200}
                  className="mx-auto mt-1.5 mb-3 max-w-[190px]"
                />
                <p className="text-center text-[14.5px] text-ink-2">
                  Navy, teal and lime — shield, ball and pitch markings.
                </p>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      <section className="bg-navy-800 py-12 md:py-17">
        <Wrap>
          <SectionHead
            onDark
            eyebrow="Keeping it current"
            title="How this site is updated"
            description="Player and match information is managed in the admin CMS and rendered from the database."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="rounded border border-white/10 bg-navy-700 p-[22px]">
                <h3 className="mb-2 text-[17px] uppercase text-white">{step.title}</h3>
                <p className="text-[14.5px] text-white/70">{step.body}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>
    </>
  );
}
