import type {
  Fixture,
  OpponentRow,
  Player,
  ScoredFixture,
  ScorerRow,
  SeasonTotals,
} from "@/types";

/**
 * Every number on the public site is derived here, from the match log alone.
 * Pure functions, no React, no data fetching — the same rule the static site
 * followed, which is why the squad page and the results page can never
 * disagree with each other.
 */

export function scoreFixture(fixture: Fixture): ScoredFixture {
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const event of fixture.events) {
    if (event.team === "PFC") goalsFor += 1;
    else goalsAgainst += 1;
  }

  const result =
    fixture.status !== "PLAYED"
      ? null
      : goalsFor > goalsAgainst
        ? "W"
        : goalsFor < goalsAgainst
          ? "L"
          : "D";

  return { ...fixture, goalsFor, goalsAgainst, result };
}

export function scoreFixtures(fixtures: Fixture[]): ScoredFixture[] {
  return fixtures.map(scoreFixture);
}

const byDateAsc = (a: Fixture, b: Fixture) => a.date.getTime() - b.date.getTime();

export function splitFixtures(fixtures: Fixture[]) {
  const scored = scoreFixtures(fixtures);
  return {
    played: scored.filter((f) => f.status === "PLAYED").sort(byDateAsc),
    upcoming: scored.filter((f) => f.status === "UPCOMING").sort(byDateAsc),
  };
}

export function seasonTotals(played: ScoredFixture[]): SeasonTotals {
  const totals = played.reduce<SeasonTotals>(
    (acc, fixture) => {
      acc.played += 1;
      acc.goalsFor += fixture.goalsFor;
      acc.goalsAgainst += fixture.goalsAgainst;
      if (fixture.result === "W") acc.won += 1;
      else if (fixture.result === "D") acc.drawn += 1;
      else if (fixture.result === "L") acc.lost += 1;
      if (fixture.goalsAgainst === 0) acc.cleanSheets += 1;
      return acc;
    },
    {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      cleanSheets: 0,
      winPct: 0,
    },
  );

  totals.goalDifference = totals.goalsFor - totals.goalsAgainst;
  totals.winPct = totals.played ? Math.round((totals.won / totals.played) * 100) : 0;
  return totals;
}

/** The last five results, oldest first — the form guide. */
export function recentForm(played: ScoredFixture[], count = 5) {
  return played
    .slice(-count)
    .map((f) => f.result)
    .filter((r): r is "W" | "D" | "L" => r !== null);
}

/**
 * Goal contributions.
 *
 * A goal is credited to a squad member by `playerId` when the admin linked
 * one, and falls back to the free-text scorer name otherwise — which is how
 * the historic records imported from the static site still count.
 */
export function scorerTable(played: ScoredFixture[], players: Player[] = []): ScorerRow[] {
  const byId = new Map(players.map((p) => [p.id, p.name]));
  const rows = new Map<string, ScorerRow>();

  const bucket = (name: string) => {
    const existing = rows.get(name);
    if (existing) return existing;
    const created: ScorerRow = { name, goals: 0, assists: 0 };
    rows.set(name, created);
    return created;
  };

  for (const fixture of played) {
    for (const event of fixture.events) {
      if (event.team !== "PFC") continue;
      const scorer = (event.playerId ? byId.get(event.playerId) : null) ?? event.scorerName;
      if (scorer) bucket(scorer).goals += 1;
      if (event.assistName) bucket(event.assistName).assists += 1;
    }
  }

  return [...rows.values()].sort(
    (a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name),
  );
}

export function statsForPlayer(player: Player, table: ScorerRow[]): ScorerRow {
  return table.find((row) => row.name === player.name) ?? { name: player.name, goals: 0, assists: 0 };
}

export function opponentTable(played: ScoredFixture[]): OpponentRow[] {
  const rows = new Map<string, OpponentRow>();

  for (const fixture of played) {
    const row =
      rows.get(fixture.opponent) ??
      ({
        name: fixture.opponent,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      } satisfies OpponentRow);

    row.played += 1;
    row.goalsFor += fixture.goalsFor;
    row.goalsAgainst += fixture.goalsAgainst;
    if (fixture.result === "W") row.won += 1;
    else if (fixture.result === "D") row.drawn += 1;
    else if (fixture.result === "L") row.lost += 1;

    rows.set(fixture.opponent, row);
  }

  return [...rows.values()].sort((a, b) => b.played - a.played || a.name.localeCompare(b.name));
}
