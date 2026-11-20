-- Catalog: categories and the food items inside them.

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 30),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  constraint categories_name_key unique (name)
);

create table public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories (id) on delete restrict,
  name          text not null check (char_length(name) between 1 and 60),
  description   text not null default '' check (char_length(description) <= 100),
  price         numeric(10, 2) not null check (price >= 0),
  emoji         text not null default '🍽️',
  image_url     text,
  is_available  boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index menu_items_category_sort_idx on public.menu_items (category_id, sort_order);

-- Shared trigger function: keeps updated_at honest on every table that has the column.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger menu_items_set_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();
