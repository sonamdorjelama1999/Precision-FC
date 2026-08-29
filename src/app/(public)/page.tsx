import Image from "next/image";
import Link from "next/link";

import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CLUB } from "@/data/club";

/**
 * The home page is the hero and nothing else — one statement, one way in.
 *
 * It reads no player or fixture data, so it is fully static: no database
 * round-trip, and nothing to revalidate.
 */
export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-14 pb-13 text-white md:pt-[84px] md:pb-[76px]">
      <div className="pfc-hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="pfc-hero-grid pointer-events-none absolute inset-0" aria-hidden />

      <Wrap className="relative z-10">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-9 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
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
                href="/squad"
                className="inline-flex items-center gap-2.5 rounded-[3px] border-2 border-lime bg-lime px-[22px] py-[13px] font-display text-sm font-bold uppercase tracking-[0.06em] text-navy-900 transition hover:-translate-y-px hover:border-lime-dark hover:bg-lime-dark"
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
          <HeroFact label="The rivalry" value={CLUB.rival} />
        </dl>
      </Wrap>
    </section>
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
