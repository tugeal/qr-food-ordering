-- Row level security on every table. Visitors can read; nobody can write through the API yet.
-- Admin write policies arrive with sign-in in Phase 4.

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.settings   enable row level security;

grant select on public.categories, public.menu_items, public.settings to anon, authenticated;

create policy "Anyone can read active categories"
  on public.categories for select to anon, authenticated
  using (is_active);

create policy "Anyone can read items in active categories"
  on public.menu_items for select to anon, authenticated
  using (exists (select 1 from public.categories c where c.id = category_id and c.is_active));

create policy "Anyone can read public settings"
  on public.settings for select to anon, authenticated
  using (key in ('restaurant_name', 'site_url'));
