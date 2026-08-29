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

/**
 * The feature panels under the hero on the home page.
 *
 * Copy and images live here rather than in the component, so a panel can be
 * reworded or its poster swapped without touching JSX. Panels alternate sides
 * automatically — the first has its image on the right, the next on the left,
 * and so on — so adding a third needs nothing but another entry.
 *
 * `width`/`height` are the file's real pixel dimensions: the panel takes its
 * aspect ratio from them, so a landscape poster works without a code change.
 */
export interface HomeFeature {
  eyebrow: string;
  title: string;
  body: string;
  footnote: string;
  image: { src: string; alt: string; width: number; height: number };
}

export const HOME_FEATURES: HomeFeature[] = [
  {
    eyebrow: "Matchday",
    title: "The front two",
    body:
      "The sharp end of a Precision FC side is built on movement and timing — a pass weighted to arrive where the run is going, and a finish that goes where it was meant to.",
    footnote: "Two up top, and neither of them is coming back to help you.",
    image: {
      src: "/deadly-duo.jpg",
      alt: "Precision FC matchday poster — two players in the club's white and green kit under the headline Deadly Duo",
      width: 1000,
      height: 1250,
    },
  },
  {
    eyebrow: "Number 19",
    title: "Know the name",
    body:
      "Sudip turns and points at the back of the shirt, because that is the point of the shirt. The number goes to whoever earns it, and it stays earned only as long as the performances do.",
    footnote: "No slogans. Just the record.",
    image: {
      src: "/sudip-19.jpg",
      alt: "Sudip, number 19, seen from behind under floodlights pointing at the name on the back of his shirt",
      width: 900,
      height: 1200,
    },
  },
];
