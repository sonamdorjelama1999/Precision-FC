/**
 * Domain types shared by every layer above the database: components, Server
 * Actions, and each feature's queries.ts. They mirror what Prisma generates
 * rather than importing its types directly, so a component never has to know
 * whether a field came from the database or was composed on the way there
 * (see e.g. Team.playerCount, added by a query's `_count` rather than living
 * in the table).
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
  /** Nullable — a player does not have to belong to a team. */
  teamId: string | null;
  /** Only present when the query explicitly includes it. */
  team?: Team | null;
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
  /** Shown on /contact and used as the mailto: target. */
  email: string;
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

// ---------------------------------------------------------------------------
// Club teams and matches
// ---------------------------------------------------------------------------
//
// "Team" here is the football/futsal club entity (Precision FC and its
// opponents) — a different domain from the StaffMember/Sponsor "team" above.
// See the naming note in prisma/schema.prisma.

export interface Team {
  id: string;
  name: string;
  logoUrl: string | null;
  logoPath: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** Only present when the query explicitly includes it. */
  playerCount?: number;
}

export const MATCH_TYPES = ["FRIENDLY", "LEAGUE", "CUP", "TOURNAMENT", "OTHER"] as const;
export type MatchType = (typeof MATCH_TYPES)[number];

export const MATCH_TYPE_LABEL: Record<MatchType, string> = {
  FRIENDLY: "Friendly",
  LEAGUE: "League",
  CUP: "Cup",
  TOURNAMENT: "Tournament",
  OTHER: "Other",
};

/**
 * Named FixtureStatus (not MatchStatus) only because MatchStatus already
 * names the legacy Fixture model's two-value status above.
 */
export const FIXTURE_STATUSES = [
  "SCHEDULED",
  "LIVE",
  "COMPLETED",
  "POSTPONED",
  "CANCELLED",
] as const;
export type FixtureStatus = (typeof FIXTURE_STATUSES)[number];

export const FIXTURE_STATUS_LABEL: Record<FixtureStatus, string> = {
  SCHEDULED: "Scheduled",
  LIVE: "Live",
  COMPLETED: "Completed",
  POSTPONED: "Postponed",
  CANCELLED: "Cancelled",
};

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: Team;
  awayTeam: Team;
  scheduledAt: Date;
  venue: string | null;
  matchType: MatchType;
  competitionName: string | null;
  status: FixtureStatus;
  homeScore: number | null;
  awayScore: number | null;
  notes: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Plain text; paragraphs are separated by a blank line. */
  body: string;
  coverUrl: string | null;
  coverPath: string | null;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const CONTACT_REASONS = ["GENERAL", "SPONSORSHIP", "MEDIA", "OTHER"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];

export const CONTACT_REASON_LABEL: Record<ContactReason, string> = {
  GENERAL: "General enquiry",
  SPONSORSHIP: "Sponsorship",
  MEDIA: "Media",
  OTHER: "Other",
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  reason: ContactReason;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
