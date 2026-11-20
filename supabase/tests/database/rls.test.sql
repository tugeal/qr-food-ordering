-- Run with: npx supabase test db
begin;
select plan(5);

select ok((select relrowsecurity from pg_class where oid = 'public.categories'::regclass), 'categories has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.menu_items'::regclass), 'menu_items has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.settings'::regclass), 'settings has RLS enabled');

set local role anon;
select throws_ok($$insert into public.categories (name) values ('Hacked')$$, '42501', null, 'anon cannot insert categories');
select throws_ok($$update public.menu_items set price = 0$$, '42501', null, 'anon cannot change prices');
reset role;

select * from finish();
rollback;
