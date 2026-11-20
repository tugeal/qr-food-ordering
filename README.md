# QR Food Ordering

Customers scan a QR code, browse a digital menu and (from Phase 2) order and pay by GCash, Maya or bank transfer. Built with Next.js, Supabase and Vercel.

## Status

- [x] Setup: project, database migrations, seed data, CI
- [x] Phase 1: QR menu (categories, food cards, availability) and the QR code page
- [ ] Phase 2: cart, checkout and orders
- [ ] Phase 3: payment methods
- [ ] Phase 4: admin dashboard and sign-in

## Run it locally

You need Node 20.9 or newer (22 recommended) and pnpm (`npm install -g pnpm`).

1. Install packages with `pnpm install`, then commit the `pnpm-lock.yaml` it creates.
2. Create a Supabase project in the Southeast Asia (Singapore) region.
3. Create the tables: in the Supabase dashboard open SQL Editor and run each file in `supabase/migrations/` in order, then `supabase/seed.sql`.
4. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key (dashboard: Project Settings, API Keys).
5. Start the app with `pnpm dev` and open http://localhost:3000.

The QR code page is at `/admin/qr`. To test on a phone, join the same Wi-Fi and open the Network address that `pnpm dev` prints.

If the Supabase CLI complains about `supabase/config.toml`, run `npx supabase init --force`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` | ESLint, including the import-boundary rules |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm db:push` | Apply migrations to the linked Supabase project |
| `pnpm db:types` | Regenerate `src/types/database.ts` from the database |

## Project structure

```
src/
  app/          routes only, no business logic
  components/   layout/ and ui/ (the shared design system)
  config/       constants
  features/     one folder per capability (menu, settings; later cart, checkout, orders, payments)
  lib/          env, Supabase clients, formatting, helpers
  styles/       design tokens, base styles, fonts
  types/        database types
supabase/       migrations, seed data, database tests
docs/           deployment runbook
```

## Conventions

- Imports flow one way: app, then features, then components/ui and lib. Features never import each other (ESLint enforces it).
- Every `queries.ts` imports `server-only`, so server code and secrets cannot reach the browser.
- Every table has row level security. Visitors can only read the active menu and public settings.
- Environment variables are read once, in `src/lib/env.ts`.
- A component, its CSS Module and its test live side by side.
- After changing the database, run `pnpm db:types`.

Deployment steps are in [docs/deployment.md](docs/deployment.md).
