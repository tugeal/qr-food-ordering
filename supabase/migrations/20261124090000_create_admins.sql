-- Who may use the admin dashboard. Supabase Auth proves who someone is; this table decides whether
-- they are an admin. The server reads it with the secret key, so switching public sign-ups back on
-- can never turn a stranger into an admin.

create table public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.admins enable row level security;

-- No policies on purpose: only the server can read or change this table.
revoke all on public.admins from anon, authenticated;
grant all on public.admins to service_role;
