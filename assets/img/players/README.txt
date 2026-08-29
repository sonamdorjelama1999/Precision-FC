Player photos go in this folder.

- Portrait crop, roughly 3:4 (600 x 800 works well), head near the top.
- A cut-out on a transparent PNG looks best, since the card supplies its own
  background — but an ordinary photo is fine too.
- Name the file after the player, e.g. asok-sunuwar.png, then point at it from
  assets/js/data.js:

      photo: "assets/img/players/asok-sunuwar.png"

- A player with photo: null (or a path that does not resolve) falls back to
  their initials over the crest. Nothing breaks.
