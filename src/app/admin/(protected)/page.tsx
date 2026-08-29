import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getFixtures } from "@/features/fixtures/queries";
import { getPlayers } from "@/features/players/queries";
import { signed } from "@/lib/format";
import { seasonTotals, splitFixtures } from "@/lib/stats";

export default async function AdminDashboardPage() {
  const [players, fixtures] = await Promise.all([getPlayers(), getFixtures()]);
  const { played, upcoming } = splitFixtures(fixtures);
  const totals = seasonTotals(played);

  const withPhoto = players.filter((player) => player.photoUrl).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
            Dashboard
          </p>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Overview</h1>
          <p className="mt-2 text-muted-foreground">
            Changes here appear on the public site immediately.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href="/admin/players/new">
            <Plus className="size-4" />
            Add player
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile value={players.length} label="Players" />
        <Tile value={`${withPhoto}/${players.length}`} label="With photos" />
        <Tile value={totals.played} label="Matches played" />
        <Tile value={signed(totals.goalDifference)} label="Goal difference" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Squad"
          body={
            players.length === 0
              ? "No players yet. The public squad page shows an empty state until you add one."
              : `${players.length} player${players.length === 1 ? "" : "s"} on the public squad page, ${withPhoto} with a photo.`
          }
          href="/admin/players"
          cta="Manage players"
        />
        <Panel
          title="Next fixture"
          body={
            upcoming[0]
              ? `Precision FC v ${upcoming[0].opponent} — ${upcoming[0].competition}.`
              : "Nothing scheduled. The home page hides the fixture card until one exists."
          }
          href="/fixtures"
          cta="View public fixtures"
        />
      </div>
    </div>
  );
}

function Tile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-lg border border-border border-t-[3px] border-t-teal bg-card p-5">
      <b className="block font-mono text-4xl leading-none font-semibold tracking-[-0.03em] tabular-nums">
        {value}
      </b>
      <span className="mt-2.5 block font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Panel({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-2 text-lg font-bold uppercase tracking-[-0.01em]">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{body}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-teal-dark hover:text-ink"
      >
        {cta}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
