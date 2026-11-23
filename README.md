# QR Food Ordering

Customers scan a QR code, browse a digital menu, order, and pay by GCash, Maya or bank transfer. The restaurant runs everything from an admin dashboard. Built with Next.js, Supabase and Vercel.

## Status

- [x] Setup: project, database migrations, seed data, CI
- [x] Phase 1: QR menu (categories, food cards, availability) and the QR code page
- [x] Phase 2: cart, checkout, server-priced orders, order page with live status
- [x] Phase 3: payment methods, payment instructions and reference numbers
- [x] Phase 4: admin sign-in and dashboard (orders, menu and photos, payments, QR code)

## Run it locally

You need Node 20.9 or newer (22 recommended) and pnpm (`npm install -g pnpm`).

1. Install packages with `pnpm install`, then commit the `pnpm-lock.yaml` it creates.
2. Create a Supabase project in the Southeast Asia (Singapore) region.
3. Create the tables: in the Supabase dashboard open SQL Editor and run each file in `supabase/migrations/` in order, then `supabase/seed.sql`.
4. Copy `.env.example` to `.env.local` and fill in the project URL, the publishable key and a secret key (dashboard: Project Settings, API Keys).
5. Create your admin account: follow [docs/admin-setup.md](docs/admin-setup.md).
6. Start the app with `pnpm dev`, open http://localhost:3000, and sign in at http://localhost:3000/admin/login.

To test on a phone, join the same Wi-Fi and open the Network address that `pnpm dev` prints.

Already ran Phase 3? Unzip this version over your folder, run only the two new migration files (dated 20261124) in the SQL Editor, create your admin account ([docs/admin-setup.md](docs/admin-setup.md)), and restart `pnpm dev`. There are no new packages and no new environment variables.

If the Supabase CLI complains about `supabase/config.toml`, run `npx supabase init --force`.

## The admin dashboard

Sign in at `/admin/login`. Only users listed in the `admins` table get in.

| Tab | What you do |
| --- | --- |
| Orders | See every order, filter by status, change its status, mark it paid, open its details. The page refreshes itself every 10 seconds. |
| Menu | Add, rename and delete categories. Add, edit, delete and sell-out food items, with photos. |
| Payments | Switch GCash, Maya and bank transfer on or off and set the account details customers see. |
| QR code | Set the restaurant name and menu link, then download the QR code as PNG or SVG. |

## How an order works

1. The cart lives in the browser (localStorage), so it survives a refresh.
2. At checkout the customer picks a payment method, and the browser sends only item ids, quantities and that choice to a Server Action.
3. The action validates the input (Zod, honeypot) and calls the `create_order` database function with the secret key.
4. The function checks availability and the payment method, copies names and prices from the menu, saves the order and its items in one transaction, and throttles each phone number to 5 orders per 10 minutes.
5. The customer lands on `/order/<random id>`. It shows the account details and exact amount, lets them save a reference number, and polls `/api/orders/<id>` every 10 seconds for status and payment changes.
6. The restaurant sees the order on the Orders tab, updates its status and marks it paid when the money arrives.

## How the admin is protected

- Supabase Auth proves who you are; the `admins` table decides whether you may use the dashboard. Turning public sign-ups back on can never make a stranger an admin.
- `src/proxy.ts` refreshes the session and sends signed-out visitors to the login page.
- Every admin page, query, Server Action and API route checks the role again with `getAdminUser()` or `requireAdmin()`, because a layout check alone is not enough.
- Admin actions run with the secret key only after that check, and photo uploads are verified by their file contents, not their names.

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
  features/     one folder per capability (auth, cart, checkout, menu, orders, payments, settings)
  hooks/        shared React hooks
  lib/          env, auth, Supabase clients, actions helper, formatting, storage
  proxy.ts      session refresh and sign-in redirect for /admin
  styles/       design tokens, base styles, fonts
  types/        database types
supabase/       migrations, seed data, database tests
docs/           admin setup and deployment runbooks
```

## Conventions

- Imports flow one way: app, then features, then components/ui, hooks, config and lib. Features never import each other (ESLint enforces it); pages and `_components` compose them.
- Every `queries.ts` imports `server-only`, so server code and secrets cannot reach the browser.
- Prices are never trusted from the browser: the `create_order` function prices every order.
- Every table has row level security. Visitors can read the active menu and public settings, and nothing else; everything else goes through the server.
- Environment variables are read once: `src/lib/env.ts` (public) and `src/lib/env.server.ts` (secrets).
- A component, its CSS Module and its test live side by side.
- After changing the database, run `pnpm db:types`.

Deployment steps are in [docs/deployment.md](docs/deployment.md).
