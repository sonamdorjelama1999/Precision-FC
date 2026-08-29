"use client";

import { useState } from "react";

import { CLUB } from "@/data/club";
import { formatDate, formatDay } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ScoredFixture } from "@/types";

/**
 * One result row, expanding to the goal timeline. Client component for the
 * disclosure state only — everything it renders comes in as props.
 */
export function MatchRow({ fixture }: { fixture: ScoredFixture }) {
  const [open, setOpen] = useState(false);

  const upcoming = fixture.status === "UPCOMING";
  const left = fixture.isHome ? CLUB.name : fixture.opponent;
  const right = fixture.isHome ? fixture.opponent : CLUB.name;
  const scoreline = fixture.isHome
    ? `${fixture.goalsFor} – ${fixture.goalsAgainst}`
    : `${fixture.goalsAgainst} – ${fixture.goalsFor}`;

  const meta = [
    upcoming ? null : fixture.result === "W" ? "Win" : fixture.result === "D" ? "Draw" : "Loss",
    fixture.competition,
    fixture.isHome ? CLUB.ground : "Away",
  ]
    .filter(Boolean)
    .join(" · ");

  const events = [...fixture.events].sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));
  const expandable = !upcoming;

  return (
    <article className="overflow-hidden rounded border border-line bg-paper-2">
      <button
        type="button"
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-2.5 px-5 py-4 text-left",
          "[grid-template-areas:'date_chev''teams_score']",
          "md:grid-cols-[128px_minmax(0,1fr)_auto_auto] md:gap-[18px] md:[grid-template-areas:'date_teams_score_chev']",
          expandable && "cursor-pointer hover:bg-[#f7f9f9]",
        )}
      >
        <span className="[grid-area:date] font-mono text-[11px] uppercase leading-[1.5] tracking-[0.1em] text-ink-3">
          <b className="block font-semibold tracking-[0.06em] text-ink">{formatDate(fixture.date)}</b>
          {upcoming && fixture.kickoff ? `Kick-off ${fixture.kickoff}` : formatDay(fixture.date)}
        </span>

        <span className="[grid-area:teams] font-display text-[17px] font-bold tracking-[-0.01em]">
          {left} <span className="font-normal text-ink-3">v</span> {right}
          <small className="mt-1 block font-mono text-[10.5px] font-normal uppercase tracking-[0.13em] text-ink-3">
            {meta}
          </small>
        </span>

        {upcoming ? (
          <span className="[grid-area:score] justify-self-end self-center rounded-[3px] border border-dashed border-line-strong px-3.5 py-[9px] font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
            Upcoming
          </span>
        ) : (
          <span className="[grid-area:score] justify-self-end self-center rounded-[3px] bg-navy-800 px-3.5 py-1.5 font-mono text-[22px] font-semibold tracking-[-0.02em] whitespace-nowrap tabular-nums text-white">
            {scoreline}
          </span>
        )}

        <span
          aria-hidden
          className={cn(
            "[grid-area:chev] justify-self-end self-start text-[13px] text-ink-3 transition-transform md:self-center",
            open && "rotate-180",
          )}
        >
          {expandable ? "▼" : ""}
        </span>
      </button>

      {expandable && open ? (
        <div className="border-t border-line bg-[#fbfcfc] p-5">
          {fixture.note ? (
            <p className="mb-3.5 text-[14.5px] text-ink-2">{fixture.note}</p>
          ) : null}
          <ul>
            {events.length === 0 ? (
              <TimelineRow minute={null} isClub={false}>
                <em>No goal detail recorded for this match.</em>
              </TimelineRow>
            ) : (
              events.map((event) => (
                <TimelineRow key={event.id} minute={event.minute} isClub={event.team === "PFC"}>
                  <span className="font-semibold">
                    {event.scorerName ?? <em className="font-normal">Scorer not recorded</em>}
                  </span>{" "}
                  <small className="font-normal text-ink-3">
                    — {event.team === "PFC" ? CLUB.short : fixture.opponent}
                  </small>
                  {event.assistName ? (
                    <small className="font-normal text-ink-3"> assist {event.assistName}</small>
                  ) : null}
                </TimelineRow>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function TimelineRow({
  minute,
  isClub,
  children,
}: {
  minute: number | null;
  isClub: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[56px_12px_minmax(0,1fr)] items-baseline gap-3 border-b border-dashed border-line py-[7px] last:border-b-0">
      <span className="font-mono text-xs tabular-nums text-ink-3">
        {minute !== null ? `${minute}′` : "—"}
      </span>
      <span
        className={cn(
          "size-2 self-center rounded-full",
          isClub ? "bg-teal" : "bg-line-strong",
        )}
      />
      <span className="text-[14.5px]">{children}</span>
    </li>
  );
}
