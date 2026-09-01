import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getUnreadMessageCount, getMessages } from "@/features/contact/queries";
import { getMatchCounts } from "@/features/matches/queries";
import { getNewsPosts } from "@/features/news/queries";
import { getPlayers } from "@/features/players/queries";
import { getSponsors, getStaff } from "@/features/team/queries";
import { getTeams } from "@/features/teams/queries";

/**
 * Read-only overview. Every number here links back to Team Management,
 * Matches, News or Messages — Players, Staff and Sponsors no longer have
 * their own sidebar tabs, so this page (and each team's card) is how an
 * admin gets to them.
 */
export default async function AdminDashboardPage() {
  const [players, staff, sponsors, teams, matchCounts, newsPosts, messages, unreadCount] =
    await Promise.all([
      getPlayers(),
      getStaff(),
      getSponsors(),
      getTeams(),
      getMatchCounts(),
      getNewsPosts(),
      getMessages(),
      getUnreadMessageCount(),
    ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          Dashboard
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Changes here appear on the public site immediately.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile value={teams.length} label="Teams" />
        <Tile value={players.length} label="Players" />
        <Tile value={matchCounts.upcoming} label="Upcoming matches" />
        <Tile value={matchCounts.completed} label="Results recorded" />
        <Tile value={newsPosts.length} label="News posts" />
        <Tile value={unreadCount} label="Unread messages" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Team Management"
          body={
            teams.length === 0
              ? "Add Precision FC first and mark it primary, then add opponents. Players, staff and sponsors are all managed from a team's card."
              : `${teams.length} team${teams.length === 1 ? "" : "s"}, ${players.length} player${players.length === 1 ? "" : "s"}, ${staff.length} staff member${staff.length === 1 ? "" : "s"} and ${sponsors.length} sponsor${sponsors.length === 1 ? "" : "s"}.`
          }
          href="/admin/teams"
          cta="Go to Teams"
        />
        <Panel
          title="Matches"
          body={
            matchCounts.upcoming === 0 && matchCounts.completed === 0
              ? "No matches scheduled yet."
              : `${matchCounts.upcoming} upcoming, ${matchCounts.completed} completed — both shown on the public Fixtures page once published.`
          }
          href="/admin/matches"
          cta="Go to Matches"
        />
        <Panel
          title="News"
          body={
            newsPosts.length === 0
              ? "No posts yet. Publish the first update and it appears on the public News page."
              : `${newsPosts.length} post${newsPosts.length === 1 ? "" : "s"}, ${newsPosts.filter((post) => post.isPublished).length} published.`
          }
          href="/admin/news"
          cta="Go to News"
        />
        <Panel
          title="Messages"
          body={
            messages.length === 0
              ? "No messages yet. Submissions from the public Contact page appear here."
              : `${messages.length} message${messages.length === 1 ? "" : "s"}${unreadCount > 0 ? `, ${unreadCount} unread` : ""}.`
          }
          href="/admin/messages"
          cta="Go to Messages"
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
