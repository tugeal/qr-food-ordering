-- Key/value settings. Only non-secret values belong here (see the RLS migration).

create table public.settings (
  key         text primary key check (key ~ '^[a-z_]+$'),
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

create trigger settings_set_updated_at
before update on public.settings
for each row execute function public.set_updated_at();
