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
    "The club plays one way: forward.",
  email: "hello@precisionfc.club",
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
      "The fixture the season is measured by is against Yangrima FC, a side the club has met " +
      "repeatedly at Rumble. It is the only fixture on the calendar that gets its own name.",
  },
  {
    heading: "How we play",
    body:
      "Precision FC does not set up to defend. The plan is to keep the ball going forward and to " +
      "outscore whatever the other side manages — the game gets settled at the top of the pitch, " +
      "not the bottom of it.",
  },
];
