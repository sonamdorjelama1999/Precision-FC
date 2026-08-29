import type { Metadata } from "next";
import Image from "next/image";

import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CLUB, STORY } from "@/data/club";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Club",
  description: `The story of Precision FC: founded ${CLUB.founded}, based at ${CLUB.ground} in Kathmandu, and the rivalry with ${CLUB.rival}.`,
};

export default function AboutPage() {
  const facts: Array<[string, string]> = [
    ["Founded", String(CLUB.founded)],
    ["Sport", CLUB.sport],
    ["Home", CLUB.ground],
    ["Based in", CLUB.city],
    ["Rivalry", CLUB.rival],
  ];

  return (
    <>
      <PageHead
        eyebrow={`Since ${CLUB.founded}`}
        title="The club"
        description="Who Precision FC are, and where the club plays."
      />

      <section className="py-12 md:py-17">
        <Wrap>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-9 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
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
    </>
  );
}
