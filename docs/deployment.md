# Deployment (Vercel + Supabase)

## 1. Supabase

1. Create a project in the Southeast Asia (Singapore) region.
2. SQL Editor: run every file in `supabase/migrations/` in order, then `supabase/seed.sql`.
3. Project Settings, API Keys: copy the Project URL, the publishable key and a secret key.
4. Create your admin account and turn off public sign-ups: see [admin-setup.md](admin-setup.md).

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

## 3. Set up the restaurant in the dashboard

1. Sign in at `/admin/login`.
2. Payments: replace the placeholder account details and switch on the methods you use.
3. Menu: replace the sample food with yours, and add photos.
4. QR code: confirm the menu link and restaurant name, download the PNG and print it. Print only after the final domain is set.

## 4. Test an order on the live site

1. Scan the QR code with a phone, add items, choose a payment method, check out, and save a reference number.
2. In the dashboard, Orders: the order appears within about ten seconds. Change its status and mark it paid, and watch the customer's page update.
3. Delete your test orders in Supabase, Table Editor, `orders`.

## 5. Before taking real orders

- Vercel's free Hobby plan is for non-commercial use, so use a paid plan for a live restaurant.
- Supabase free projects pause after a week of inactivity and have no automatic backups. Consider the Pro plan for production.
- Use a long, unique admin password, and keep public sign-ups switched off.
