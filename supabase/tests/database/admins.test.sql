-- Run with: npx supabase test db
begin;
select plan(3);

select ok((select relrowsecurity from pg_class where oid = 'public.admins'::regclass), 'admins has RLS enabled');

set local role anon;
select throws_ok($$select * from public.admins$$, '42501', null, 'anon cannot read admins');
reset role;

set local role authenticated;
select throws_ok($$select * from public.admins$$, '42501', null, 'signed-in users cannot read admins');
reset role;

select * from finish();
rollback;
