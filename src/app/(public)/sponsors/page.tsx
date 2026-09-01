import Image from "next/image";
import Link from "next/link";

import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { getSponsors } from "@/features/team/queries";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { SPONSOR_TIER_LABEL, SPONSOR_TIERS, type Sponsor } from "@/types";

/**
 * Statically rendered and re-generated on demand, same pattern as every
 * other data-backed public page — the admin sponsor actions already call
 * revalidatePath("/") and this is the safety net.
 */
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Sponsors",
  description: "The partners and supporters behind Precision FC.",
  path: "/sponsors",
});

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const groups = SPONSOR_TIERS.map((tier) => ({
    tier,
    sponsors: sponsors.filter((sponsor) => sponsor.tier === tier),
  })).filter((group) => group.sponsors.length > 0);

  return (
    <>
      <PageHead
        eyebrow="Backing the club"
        title="Sponsors"
        description="The businesses and individuals who make Precision FC possible."
      />

      <section className="py-12 md:py-17">
        <Wrap className="space-y-12">
          {groups.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No sponsors listed yet.
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.tier}>
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-teal-dark">
                  {SPONSOR_TIER_LABEL[group.tier]}
                </p>
                <div
                  className={cn(
                    "grid gap-5",
                    group.tier === "PRINCIPAL" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {group.sponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="rounded-card border border-border bg-card p-8 text-center">
            <h2 className="font-display text-xl font-bold uppercase tracking-[-0.01em]">
              Become a sponsor
            </h2>
            <p className="mx-auto mt-2 max-w-[52ch] text-muted-foreground">
              Get in touch to talk about backing the club — principal, partner and supporter
              tiers are all open.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-[3px] border-2 border-teal-dark bg-teal-dark px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:-translate-y-px"
            >
              Get in touch
            </Link>
          </div>
        </Wrap>
      </section>
    </>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-card border border-border bg-card p-7 text-center transition-colors hover:border-teal-dark/40">
      <div className="relative flex h-16 w-full items-center justify-center">
        {sponsor.logoUrl ? (
          <Image
            src={sponsor.logoUrl}
            alt={sponsor.name}
            fill
            sizes="200px"
            className="object-contain"
          />
        ) : (
          <span className="font-display text-lg font-extrabold tracking-[-0.01em] uppercase">
            {sponsor.name}
          </span>
        )}
      </div>
      {sponsor.logoUrl ? <span className="text-sm font-medium">{sponsor.name}</span> : null}
    </div>
  );

  if (!sponsor.websiteUrl) return content;

  return (
    <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer sponsored">
      {content}
    </a>
  );
}
