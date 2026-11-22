# QR Food Ordering

Customers scan a QR code, browse a digital menu, order, and (from Phase 3) pay by GCash, Maya or bank transfer. Built with Next.js, Supabase and Vercel.

## Status

- [x] Setup: project, database migrations, seed data, CI
- [x] Phase 1: QR menu (categories, food cards, availability) and the QR code page
- [x] Phase 2: cart, checkout, server-priced orders, order page with live status
- [ ] Phase 3: payment methods
- [ ] Phase 4: admin dashboard and sign-in

## Run it locally

You need Node 20.9 or newer (22 recommended) and pnpm (`npm install -g pnpm`).

1. Install packages with `pnpm install`, then commit the `pnpm-lock.yaml` it creates.
2. Create a Supabase project in the Southeast Asia (Singapore) region.
3. Create the tables: in the Supabase dashboard open SQL Editor and run each file in `supabase/migrations/` in order, then `supabase/seed.sql`.
4. Copy `.env.example` to `.env.local` and fill in the project URL, the publishable key and a secret key (dashboard: Project Settings, API Keys).
5. Start the app with `pnpm dev` and open http://localhost:3000.

The QR code page is at `/admin/qr`. To test on a phone, join the same Wi-Fi and open the Network address that `pnpm dev` prints.

Already ran Phase 1? Unzip this version over your folder, run `pnpm install`, add `SUPABASE_SECRET_KEY` to `.env.local`, and run only the three new migration files (dated 20261120) in the SQL Editor.

If the Supabase CLI complains about `supabase/config.toml`, run `npx supabase init --force`.

## How an order works

1. The cart lives in the browser (localStorage), so it survives a refresh.
2. At checkout the browser sends only item ids and quantities to a Server Action.
3. The action validates the input (Zod, honeypot) and calls the `create_order` database function with the secret key.
4. The function checks availability, copies names and prices from the menu, saves the order and its items in one transaction, and throttles each phone number to 5 orders per 10 minutes.
5. The customer lands on `/order/<random id>`, which polls `/api/orders/<id>` every 10 seconds for status changes.

Until Phase 4, change an order's `status` in the Supabase Table Editor.

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
  features/     one folder per capability (menu, cart, checkout, orders, settings)
  hooks/        shared React hooks
  lib/          env, Supabase clients, actions helper, formatting, storage
  styles/       design tokens, base styles, fonts
  types/        database types
supabase/       migrations, seed data, database tests
docs/           deployment runbook
```

## Conventions

- Imports flow one way: app, then features, then components/ui, hooks and lib. Features never import each other (ESLint enforces it); pages and `_components` compose them.
- Every `queries.ts` imports `server-only`, so server code and secrets cannot reach the browser.
- Prices are never trusted from the browser: the `create_order` function prices every order.
- Every table has row level security. Visitors can read the active menu and public settings, and nothing else.
- Environment variables are read once: `src/lib/env.ts` (public) and `src/lib/env.server.ts` (secrets).
- A component, its CSS Module and its test live side by side.
- After changing the database, run `pnpm db:types`.

Deployment steps are in [docs/deployment.md](docs/deployment.md).
