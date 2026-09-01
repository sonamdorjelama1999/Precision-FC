import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Wrap } from "@/components/layout/wrap";
import { NextMatch } from "@/components/matches/next-match";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CLUB } from "@/data/club";
import { getPublicNextMatch } from "@/features/matches/queries";
import { getLatestPublicNews } from "@/features/news/queries";
import { formatDate } from "@/lib/format";

/**
 * The home page: hero, then a live "matchday" strip — next fixture and
 * latest news, each on its own row rather than side-by-side, since a single
 * feature next to a whole news list read as visually mismatched.
 *
 * This is an async server component reading real data — both reads are
 * cheap, cached queries with their own revalidatePath calls from the admin
 * side, so this stays fast without an explicit revalidate window of its own.
 */
export default async function HomePage() {
  const [nextMatch, latestNews] = await Promise.all([
    getPublicNextMatch(),
    getLatestPublicNews(3),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 pt-14 pb-13 text-white md:pt-[84px] md:pb-[76px]">
        <div className="pfc-hero-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="pfc-hero-grid pointer-events-none absolute inset-0" aria-hidden />

        <Wrap className="relative z-10">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-9 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
            <div className="max-lg:order-2">
              <Eyebrow onDark>
                Futsal &middot; Kathmandu &middot; Since {CLUB.founded}
              </Eyebrow>
              <h1 className="mb-5 text-[clamp(28px,6vw,72px)] font-black tracking-[-0.035em] whitespace-nowrap uppercase">
                Precision <span className="text-lime">FC</span>
              </h1>
              <p className="mb-7 max-w-[48ch] text-[clamp(16px,1.6vw,19px)] text-white/80">
                Defending is somebody else&rsquo;s plan. Put ten past us and we will put
                eleven past you — the only number we count is the one on our side of the
                scoreboard.
                <span className="mt-2 block font-semibold text-white">
                  Bring a keeper. You will need him more than we do.
                </span>
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

      <section className="bg-paper-2 py-12 md:py-16">
        <Wrap className="space-y-10">
          <NextMatch match={nextMatch} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <Eyebrow>Latest news</Eyebrow>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-teal-dark hover:text-ink"
              >
                All news
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {latestNews.length === 0 ? (
              <div className="rounded-card border border-dashed border-line bg-card p-7 text-center text-muted-foreground">
                No news posted yet — check back soon.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {latestNews.map((post) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group flex items-center gap-4 rounded-card border border-line bg-card p-4 transition-colors hover:border-teal-dark/40"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-navy-900">
                      {post.coverUrl ? (
                        <Image
                          src={post.coverUrl}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="pfc-page-glow absolute inset-0" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-teal-dark">
                        {formatDate(post.publishedAt)}
                      </p>
                      <p className="truncate font-display text-sm font-bold uppercase tracking-[-0.01em] group-hover:underline">
                        {post.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
