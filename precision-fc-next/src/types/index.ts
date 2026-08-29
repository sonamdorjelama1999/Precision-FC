/**
 * Domain types for the public site.
 *
 * These deliberately mirror what Prisma will generate in Phase 2, so the
 * components written in Phase 1 keep compiling unchanged once the data
 * starts coming from PostgreSQL. Only the query layer swaps out.
 */

export const PLAYER_POSITIONS = [
  "GOALKEEPER",
  "DEFENDER",
  "MIDFIELDER",
  "WINGER",
  "FORWARD",
  "PIVOT",
] as const;

export type PlayerPosition = (typeof PLAYER_POSITIONS)[number];

export const POSITION_LABEL: Record<PlayerPosition, string> = {
  GOALKEEPER: "Goalkeeper",
  DEFENDER: "Defender",
  MIDFIELDER: "Midfielder",
  WINGER: "Winger",
  FORWARD: "Forward",
  PIVOT: "Pivot",
};

export interface Player {
  id: string;
  playerNumber: number;
  name: string;
  photoUrl: string | null;
  photoPath: string | null;
  position: PlayerPosition;
  role: string | null;
  isCaptain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MatchStatus = "PLAYED" | "UPCOMING";
export type GoalTeam = "PFC" | "OPPONENT";

export interface GoalEvent {
  id: string;
  team: GoalTeam;
  minute: number | null;
  /** Free-text scorer. Kept for opponents and for goals with no squad link. */
  scorerName: string | null;
  assistName: string | null;
  /** Set when the scorer is a squad member. */
  playerId: string | null;
}

export interface Fixture {
  id: string;
  date: Date;
  opponent: string;
  isHome: boolean;
  status: MatchStatus;
  competition: string;
  kickoff: string | null;
  note: string | null;
  events: GoalEvent[];
}

/** A fixture with its scoreline worked out. */
export interface ScoredFixture extends Fixture {
  goalsFor: number;
  goalsAgainst: number;
  result: "W" | "D" | "L" | null;
}

export interface SeasonTotals {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  cleanSheets: number;
  winPct: number;
}

export interface ScorerRow {
  name: string;
  goals: number;
  assists: number;
}

export interface OpponentRow {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface ClubInfo {
  name: string;
  short: string;
  founded: number;
  city: string;
  ground: string;
  sport: string;
  rival: string;
  blurb: string;
}

export interface StoryBlock {
  heading: string;
  body: string;
}

// ---------------------------------------------------------------------------
// Team — coaching staff and sponsors
// ---------------------------------------------------------------------------

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  photoPath: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SPONSOR_TIERS = ["PRINCIPAL", "PARTNER", "SUPPORTER"] as const;
export type SponsorTier = (typeof SPONSOR_TIERS)[number];

export const SPONSOR_TIER_LABEL: Record<SponsorTier, string> = {
  PRINCIPAL: "Principal partner",
  PARTNER: "Partner",
  SUPPORTER: "Supporter",
};

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  websiteUrl: string | null;
  logoUrl: string | null;
  logoPath: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The squad page groups players by position in this order — the same
 * top-to-bottom reading a club site uses: keepers, then back to front.
 */
export const POSITION_GROUP_ORDER: PlayerPosition[] = [
  "GOALKEEPER",
  "DEFENDER",
  "MIDFIELDER",
  "WINGER",
  "PIVOT",
  "FORWARD",
];

export const POSITION_GROUP_LABEL: Record<PlayerPosition, string> = {
  GOALKEEPER: "Goalkeepers",
  DEFENDER: "Defenders",
  MIDFIELDER: "Midfielders",
  WINGER: "Wingers",
  PIVOT: "Pivots",
  FORWARD: "Forwards",
};
