// TOMBSTONE — not imported anywhere; safe to delete this file
// (src/data/static-content.ts).
//
// This was the Phase 1 placeholder data (STATIC_PLAYERS, STATIC_FIXTURES),
// carried over from the original static site before the database landed. It
// referenced the `Fixture` type, which was removed from src/types/index.ts
// when the legacy Fixture/GoalEvent models were dropped in favour of
// Team/Match — so the real content lived on in src/data/club.ts (CLUB,
// STORY) while this file quietly went stale and started failing `tsc`.
//
// Reduced to an empty module rather than deleted, since this device bridge
// has no delete capability.
export {};
