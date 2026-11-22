-- Orders and their line items. Customers never touch these tables directly: the server creates
-- and reads orders with the secret key (service_role). Admin policies arrive with sign-in in Phase 4.

create type public.order_type as enum ('dine_in', 'takeout');
create type public.order_status as enum ('pending', 'confirmed', 'preparing', 'completed', 'cancelled');

create table public.orders (
  id              uuid primary key default gen_random_uuid(),   -- random: it is the customer's link
  order_number    integer generated always as identity (start with 1001),
  customer_name   text not null check (char_length(customer_name) between 2 and 60),
  contact_number  text not null check (contact_number ~ '^09[0-9]{9}$'),
  order_type      public.order_type not null,
  table_number    text check (char_length(table_number) between 1 and 10),
  instructions    text check (char_length(instructions) between 1 and 200),
  status          public.order_status not null default 'pending',
  subtotal        numeric(10, 2) not null check (subtotal >= 0),
  total           numeric(10, 2) not null check (total >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint orders_order_number_key unique (order_number),
  constraint orders_table_only_for_dine_in check (table_number is null or order_type = 'dine_in')
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_created_at_idx on public.orders (status, created_at desc);
create index orders_contact_created_at_idx on public.orders (contact_number, created_at desc);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create table public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders (id) on delete cascade,
  menu_item_id  uuid references public.menu_items (id) on delete set null,
  item_name     text not null,                                   -- copied at order time
  unit_price    numeric(10, 2) not null check (unit_price >= 0), -- copied at order time
  quantity      integer not null check (quantity between 1 and 20),
  line_total    numeric(10, 2) not null check (line_total >= 0)
);

create index order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- No policies on purpose: anon and authenticated can neither read nor write these tables.
revoke all on public.orders, public.order_items from anon, authenticated;
grant all on public.orders, public.order_items to service_role;
