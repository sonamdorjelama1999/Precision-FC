/**
 * TOMBSTONE — safe to delete this file.
 *
 * This computed scorelines/tables/form for the legacy Fixture/GoalEvent
 * match-log, which prisma/schema.prisma no longer defines (superseded by
 * Team/Match — see that file's history). Its only callers (opponent-table,
 * form-guide, scorer-table, the pre-Team-model squad-grid) are gone too.
 *
 * Kept as an empty module rather than removed outright because this device
 * bridge can write file contents but can't delete files — deleting
 * src/lib/stats.ts by hand is the real cleanup.
 */
export {};
