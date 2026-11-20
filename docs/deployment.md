# Deployment (Vercel + Supabase)

## 1. Supabase

1. Create a project in the Southeast Asia (Singapore) region.
2. SQL Editor: run every file in `supabase/migrations/` in order, then `supabase/seed.sql`.
3. Copy the Project URL and the publishable key (Project Settings, API Keys).

## 2. Vercel

1. Push the repository to GitHub. In Vercel choose Add New, Project, and import it. The framework is detected automatically.
2. Add these environment variables for Production and Preview:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | your publishable key |
| `NEXT_PUBLIC_SITE_URL` | the public address, for example `https://menu.yourdomain.com` |

3. Deploy. `vercel.json` runs functions in Singapore (`sin1`), next to the database.
4. Add your custom domain (Project, Settings, Domains), then update `NEXT_PUBLIC_SITE_URL` and redeploy.

## 3. The QR code

Open `/admin/qr` on the live site, download the PNG and print it. The code points at the `site_url` row of the `settings` table and falls back to `NEXT_PUBLIC_SITE_URL`. Print only after the final domain is set.

## 4. Before taking real orders

- Vercel's free Hobby plan is for non-commercial use, so use a paid plan for a live restaurant.
- Supabase free projects pause after a week of inactivity and have no automatic backups. Consider the Pro plan for production.
- `/admin/qr` is public until Phase 4 adds admin sign-in.
