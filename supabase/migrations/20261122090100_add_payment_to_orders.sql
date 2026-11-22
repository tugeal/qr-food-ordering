-- Each order records how the customer chose to pay, whether it has been paid, and the reference
-- number they entered. Orders placed before Phase 3 keep a null payment_method.

create type public.payment_status as enum ('unpaid', 'paid');

alter table public.orders
  add column payment_method    text references public.payment_methods (code) on update cascade,
  add column payment_status    public.payment_status not null default 'unpaid',
  add column payment_reference text check (char_length(payment_reference) between 1 and 40);

create index orders_payment_status_idx on public.orders (payment_status, created_at desc);
