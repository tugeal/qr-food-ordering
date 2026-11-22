-- Where customers send their money. Read only by the server (secret key), so account details are
-- shown to someone who has an order link, not to anonymous visitors. Admin policies arrive in Phase 4.

create table public.payment_methods (
  code            text primary key check (code in ('gcash', 'maya', 'bank_transfer')),
  display_name    text not null check (char_length(display_name) between 1 and 40),
  account_name    text not null default '' check (char_length(account_name) <= 60),
  account_number  text not null default '' check (char_length(account_number) <= 30),
  bank_name       text not null default '' check (char_length(bank_name) <= 40),
  instructions    text not null default '' check (char_length(instructions) <= 300),
  is_active       boolean not null default false,
  sort_order      integer not null default 0,
  updated_at      timestamptz not null default now()
);

create trigger payment_methods_set_updated_at
before update on public.payment_methods
for each row execute function public.set_updated_at();

alter table public.payment_methods enable row level security;

-- No policies on purpose: anon and authenticated can neither read nor write this table.
revoke all on public.payment_methods from anon, authenticated;
grant all on public.payment_methods to service_role;

-- Starter rows so checkout works out of the box.
-- Replace the placeholder details in Table Editor (payment_methods) before taking real orders.
insert into public.payment_methods
  (code, display_name, account_name, account_number, bank_name, instructions, is_active, sort_order)
values
  ('gcash', 'GCash', 'Your restaurant name', '09XXXXXXXXX', '',
   'Send the exact amount, then save your reference number below so we can confirm your payment.', true, 1),
  ('maya', 'Maya', 'Your restaurant name', '09XXXXXXXXX', '',
   'Send the exact amount, then save your reference number below so we can confirm your payment.', true, 2),
  ('bank_transfer', 'Bank transfer', 'Your restaurant name', 'XXXX XXXX XXXX', 'Your bank',
   'Transfer the exact amount, then save your reference number below so we can confirm your payment.', true, 3)
on conflict (code) do nothing;
