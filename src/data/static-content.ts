import type { Fixture, Player } from "@/types";

/**
 * Phase 1 content, carried straight over from the static site's data.js.
 *
 * Nothing imports this directly except the query layer in
 * `features/players/queries.ts` and `features/fixtures/queries.ts`. When the
 * database lands in Phase 2, those two files start calling Prisma and this
 * file is deleted — no component has to change.
 */

const now = new Date();

export const STATIC_PLAYERS: Player[] = [
  {
    id: "static-asok-sunuwar",
    playerNumber: 10,
    name: "Asok Sunuwar",
    photoUrl: null,
    photoPath: null,
    position: "PIVOT",
    role: "Club top scorer",
    isCaptain: false,
    createdAt: now,
    updatedAt: now,
  },
];

let eventId = 0;
const nextEventId = () => `static-event-${++eventId}`;

export const STATIC_FIXTURES: Fixture[] = [
  {
    id: "static-fixture-1",
    date: new Date("2026-05-16"),
    opponent: "Gokarneswor FC",
    isHome: true,
    status: "PLAYED",
    competition: "Friendly",
    kickoff: null,
    note: null,
    events: [
      { id: nextEventId(), team: "PFC", minute: 6, scorerName: "Asok Sunuwar", assistName: null, playerId: null },
      { id: nextEventId(), team: "OPPONENT", minute: 14, scorerName: null, assistName: null, playerId: null },
      { id: nextEventId(), team: "PFC", minute: 22, scorerName: "Asok Sunuwar", assistName: null, playerId: null },
      { id: nextEventId(), team: "PFC", minute: 31, scorerName: null, assistName: null, playerId: null },
    ],
  },
  {
    id: "static-fixture-2",
    date: new Date("2026-06-13"),
    opponent: "Ama Yangri FC",
    isHome: true,
    status: "PLAYED",
    competition: "El Clasico",
    kickoff: null,
    note: "The rivalry fixture. Fourth meeting between the two clubs.",
    events: [
      { id: nextEventId(), team: "OPPONENT", minute: 9, scorerName: "Dorze Hyolmo", assistName: null, playerId: null },
      { id: nextEventId(), team: "PFC", minute: 18, scorerName: "Asok Sunuwar", assistName: null, playerId: null },
      { id: nextEventId(), team: "OPPONENT", minute: 27, scorerName: "Dorze Hyolmo", assistName: null, playerId: null },
      { id: nextEventId(), team: "PFC", minute: 35, scorerName: null, assistName: null, playerId: null },
    ],
  },
  {
    id: "static-fixture-3",
    date: new Date("2026-07-11"),
    opponent: "Thanka FC",
    isHome: false,
    status: "PLAYED",
    competition: "Friendly",
    kickoff: null,
    note: null,
    events: [
      { id: nextEventId(), team: "OPPONENT", minute: 12, scorerName: null, assistName: null, playerId: null },
      { id: nextEventId(), team: "OPPONENT", minute: 29, scorerName: null, assistName: null, playerId: null },
    ],
  },
  {
    id: "static-fixture-4",
    date: new Date("2026-08-08"),
    opponent: "Ama Yangri FC",
    isHome: false,
    status: "PLAYED",
    competition: "El Clasico",
    kickoff: null,
    note: null,
    events: [
      { id: nextEventId(), team: "PFC", minute: 4, scorerName: "Asok Sunuwar", assistName: null, playerId: null },
      { id: nextEventId(), team: "PFC", minute: 20, scorerName: "Asok Sunuwar", assistName: null, playerId: null },
      { id: nextEventId(), team: "OPPONENT", minute: 33, scorerName: "Dorze Hyolmo", assistName: null, playerId: null },
    ],
  },
  {
    id: "static-fixture-5",
    date: new Date("2026-09-12"),
    opponent: "Ama Yangri FC",
    isHome: true,
    status: "UPCOMING",
    competition: "El Clasico",
    kickoff: "18:00",
    note: null,
    events: [],
  },
];
