import type { ClubInfo, StoryBlock } from "@/types";

/**
 * Club identity and the About-page copy. Not player or fixture data, so this
 * stays in source control rather than the database — it changes once a year,
 * not once a week.
 */

export const CLUB: ClubInfo = {
  name: "Precision FC",
  short: "PFC",
  founded: 2019,
  city: "Kathmandu, Nepal",
  ground: "Rumble Futsal",
  sport: "Futsal",
  rival: "Yangrima FC",
  blurb:
    "Precision FC is a futsal side out of Kathmandu, playing its home games at Rumble Futsal. " +
    "The club keeps a full record of every fixture it plays — goals, timings and scorers — " +
    "so the story of a season is in the numbers, not just the memory of it.",
};

export const STORY: StoryBlock[] = [
  {
    heading: "The club",
    body:
      "Precision FC was founded in 2019 and plays its futsal out of Rumble Futsal in Kathmandu. " +
      "The name is the brief: close control in tight space, weight of pass, and a finish that goes " +
      "where it was meant to go.",
  },
  {
    heading: "El Clasico",
    body:
      "The fixture the season is measured by is against Ama Yangri FC — formerly Yangrima FC — a side " +
      "the club has met repeatedly at Rumble. It is the only fixture on the calendar that gets its own name.",
  },
  {
    heading: "Keeping the record",
    body:
      "Every match Precision FC plays is logged: the scoreline, the goal times, who scored and who set it up. " +
      "The tables on this site are generated from that log, so the numbers on the squad page and the " +
      "results page can never drift apart.",
  },
];

/**
 * Match dates and scores are still placeholders carried over from the static
 * site. Flip this to false once real results are in the database.
 */
export const DRAFT_DATA = true;
