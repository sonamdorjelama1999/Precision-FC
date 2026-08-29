/* ==========================================================================
   Precision FC — site data
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to update the website.
   Everything else (stats, tables, top-scorer lists, form guide) is calculated
   from what is here.

   >>> DRAFT MODE <<<
   `CLUB.draft` is true, so every page shows a yellow "draft data" banner.
   Match dates, scores and goal times below are PLACEHOLDERS so the site has
   something to render. Replace them with the real ones, then set
   draft: false to hide the banner.
   ========================================================================== */

const CLUB = {
  draft: true,               // set to false once the real data is in

  name: "Precision FC",
  short: "PFC",
  founded: 2019,
  city: "Kathmandu, Nepal",
  ground: "Rumble Futsal",
  sport: "Futsal",
  rival: "Ama Yangri FC",
  tagline: "Founded 2019. Built on movement, angles and finishing.",
  blurb:
    "Precision FC is a futsal side out of Kathmandu, playing its home games at Rumble Futsal. " +
    "The club keeps a full record of every fixture it plays — goals, timings and scorers — " +
    "so the story of a season is in the numbers, not just the memory of it.",
  email: "",                 // optional — shown in the footer if filled in
  instagram: ""              // optional — e.g. "https://instagram.com/..."
};

/* --------------------------------------------------------------------------
   SQUAD
   pos:   "GK" | "DEF" | "WING" | "PIVOT" | "UNI"   (uni = universal)
   photo: path to a player photo, or null.

   PHOTOS — the card is a portrait tile, so:
     * put files in  assets/img/players/  e.g. "assets/img/players/asok.png"
     * portrait crop, roughly 3:4 (e.g. 600 x 800), head near the top
     * a cut-out on a transparent PNG looks best — the card supplies the
       background — but a normal photo works fine too
     * no photo yet? Leave it null and the card shows the player's initials
       over the crest. Nothing breaks, and a bad path falls back the same way.

   Goals and assists are NOT written here — they are counted from FIXTURES.
   Copy the commented block below to add a player.
   -------------------------------------------------------------------------- */

const SQUAD = [
  {
    no: 10,
    name: "Asok Sunuwar",
    pos: "PIVOT",
    role: "Club top scorer",
    photo: null,
    captain: false,
    joined: null
  }

  // ,{
  //   no: 1,
  //   name: "Full Name",
  //   pos: "GK",
  //   role: "Short description, or leave as an empty string",
  //   photo: "assets/img/players/full-name.png",
  //   captain: false,
  //   joined: 2019
  // }
];

/* --------------------------------------------------------------------------
   FIXTURES
   date      "YYYY-MM-DD"
   opponent  club name
   home      true = played at Rumble Futsal, false = away
   status    "played" | "upcoming"
   comp      free text — e.g. "Friendly", "El Clasico", "League"
   events    goals in order. team: "PFC" or "OPP".
             player / assist may be null when unknown.
   The scoreline is counted from `events`, so add every goal.
   -------------------------------------------------------------------------- */

const FIXTURES = [
  {
    date: "2026-05-16",
    opponent: "Gokarneswor FC",
    home: true,
    status: "played",
    comp: "Friendly",
    events: [
      { team: "PFC", player: "Asok Sunuwar", assist: null, minute: 6 },
      { team: "OPP", player: null, assist: null, minute: 14 },
      { team: "PFC", player: "Asok Sunuwar", assist: null, minute: 22 },
      { team: "PFC", player: null, assist: null, minute: 31 }
    ],
    note: ""
  },
  {
    date: "2026-06-13",
    opponent: "Ama Yangri FC",
    home: true,
    status: "played",
    comp: "El Clasico",
    events: [
      { team: "OPP", player: "Dorze Hyolmo", assist: null, minute: 9 },
      { team: "PFC", player: "Asok Sunuwar", assist: null, minute: 18 },
      { team: "OPP", player: "Dorze Hyolmo", assist: null, minute: 27 },
      { team: "PFC", player: null, assist: null, minute: 35 }
    ],
    note: "The rivalry fixture. Fourth meeting between the two clubs."
  },
  {
    date: "2026-07-11",
    opponent: "Thanka FC",
    home: false,
    status: "played",
    comp: "Friendly",
    events: [
      { team: "OPP", player: null, assist: null, minute: 12 },
      { team: "OPP", player: null, assist: null, minute: 29 }
    ],
    note: ""
  },
  {
    date: "2026-08-08",
    opponent: "Ama Yangri FC",
    home: false,
    status: "played",
    comp: "El Clasico",
    events: [
      { team: "PFC", player: "Asok Sunuwar", assist: null, minute: 4 },
      { team: "PFC", player: "Asok Sunuwar", assist: null, minute: 20 },
      { team: "OPP", player: "Dorze Hyolmo", assist: null, minute: 33 }
    ],
    note: ""
  },
  {
    date: "2026-09-12",
    opponent: "Ama Yangri FC",
    home: true,
    status: "upcoming",
    comp: "El Clasico",
    kickoff: "18:00",
    events: [],
    note: ""
  }
];

/* --------------------------------------------------------------------------
   CLUB STORY — used on the About page. Plain text, edit freely.
   -------------------------------------------------------------------------- */

const STORY = [
  {
    heading: "The club",
    body:
      "Precision FC was founded in 2019 and plays its futsal out of Rumble Futsal in Kathmandu. " +
      "The name is the brief: close control in tight space, weight of pass, and a finish that goes " +
      "where it was meant to go."
  },
  {
    heading: "El Clasico",
    body:
      "The fixture the season is measured by is against Ama Yangri FC — formerly Yangrima FC — a side " +
      "the club has met repeatedly at Rumble. It is the only fixture on the calendar that gets its own name."
  },
  {
    heading: "Keeping the record",
    body:
      "Every match Precision FC plays is logged: the scoreline, the goal times, who scored and who set it up. " +
      "The tables on this site are generated from that log, so the numbers on the squad page and the " +
      "results page can never drift apart."
  }
];
