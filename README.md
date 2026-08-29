# Precision FC

The club site, migrated from static HTML to Next.js. Public pages are Server
Components; the admin CMS manages players and fixtures.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase PostgreSQL via Prisma |
| Storage | Supabase Storage (player photos) |
| Forms | React Hook Form + Zod |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/
├── app/
│   ├── (public)/        the club website — home, squad, fixtures, about
│   └── admin/           the CMS (added in Phase 3)
├── components/
│   ├── layout/          header, footer, page banner, draft notice
│   ├── players/         player card, squad grid, scorer table
│   ├── matches/         match row, timeline, form guide, opponent table
│   ├── admin/           CMS-only components
│   └── ui/              shared primitives + shadcn/ui
├── features/
│   ├── players/         queries.ts — the only door to player data
│   └── fixtures/        queries.ts — the only door to fixture data
├── lib/
│   ├── stats.ts         every derived number on the site, as pure functions
│   ├── format.ts        date and name formatting
│   └── utils.ts         cn()
├── data/                club identity, About copy, and Phase 1 seed content
└── types/               domain types, mirroring the Prisma models
```

**The rule that keeps this maintainable:** components never fetch. Pages call
`features/*/queries.ts`, pass plain data down, and `lib/stats.ts` derives
everything else. Swapping static content for Prisma touches only the query
files — no component changes.

## Design system

The club palette lives in `src/app/globals.css` under `@theme`, so it is
available as Tailwind utilities — `bg-navy-900`, `text-teal`, `text-lime`,
`font-display`, `rounded-card`. The four gradient-heavy effects carried over
from the static site (hero glow, hero grid, player-card ground, card scrim)
are component classes in the same file, since a long utility string would be
worse than the CSS.

Dates are formatted by hand in `lib/format.ts` rather than with
`toLocaleDateString`, so the server and the browser always produce the same
string and React never reports a hydration mismatch.

## shadcn/ui

`components.json` is configured, so new primitives install normally:

```bash
npx shadcn@latest add button input label select form table dialog alert-dialog sonner
```

## Migration status

- [x] **Phase 1** — static HTML → Next.js, design preserved
- [ ] **Phase 2** — Supabase PostgreSQL + Prisma schema, migrations, seed
- [ ] **Phase 3** — admin authentication and layout
- [ ] **Phase 4** — player CRUD
- [ ] **Phase 5** — Supabase Storage for photos
- [ ] **Phase 6** — public site reads from the database
- [ ] **Phase 7** — error handling, loading states, security review, cleanup
