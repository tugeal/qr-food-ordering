# Deployment (Vercel + Supabase)

## 1. Supabase

1. Create a project in the Southeast Asia (Singapore) region.
2. SQL Editor: run every file in `supabase/migrations/` in order, then `supabase/seed.sql`.
3. Project Settings, API Keys: copy the Project URL, the publishable key and a secret key.
4. Table Editor, `payment_methods`: replace the placeholder account details with your real ones (see README, "Payment details").

## 2. Vercel

1. Push the repository to GitHub. In Vercel choose Add New, Project, and import it. The framework is detected automatically.
2. Add these environment variables for Production and Preview:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your publishable key |
| `SUPABASE_SECRET_KEY` | your secret key (server only: never prefix it with `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SITE_URL` | the public address, for example `https://menu.yourdomain.com` |

3. Deploy. `vercel.json` runs functions in Singapore (`sin1`), next to the database.
4. Add your custom domain (Project, Settings, Domains), then update `NEXT_PUBLIC_SITE_URL` and redeploy.

## 3. The QR code

Open `/admin/qr` on the live site, download the PNG and print it. The code points at the `site_url` row of the `settings` table and falls back to `NEXT_PUBLIC_SITE_URL`. Print only after the final domain is set.

## 4. Test an order on the live site

1. Scan the QR code with a phone, add items, choose a payment method, check out.
2. The order page shows your account details and the exact amount. Save a reference number.
3. In Supabase, open Table Editor, `orders`: the order, its payment method and the reference are there.
4. Keep the order page open, change the order's `status` or set `payment_status` to `paid`, and watch the page update within about ten seconds.
5. Delete your test orders in Table Editor.

## 5. Before taking real orders

- Replace every placeholder in `payment_methods` and switch off (`is_active` = false) any method you don't use.
- Vercel's free Hobby plan is for non-commercial use, so use a paid plan for a live restaurant.
- Supabase free projects pause after a week of inactivity and have no automatic backups. Consider the Pro plan for production.
- `/admin/qr` is public, and orders can only be managed in the Supabase dashboard, until Phase 4 adds admin sign-in.
