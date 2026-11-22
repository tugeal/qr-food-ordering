-- Defense in depth for the Phase 1 tables. RLS already blocks writes; this also removes the write
-- privileges Supabase grants to anon/authenticated by default, and makes sure the server
-- (service_role, used by the secret key) keeps full access.

revoke insert, update, delete, truncate, references, trigger
  on public.categories, public.menu_items, public.settings
  from anon, authenticated;

grant all on public.categories, public.menu_items, public.settings to service_role;
