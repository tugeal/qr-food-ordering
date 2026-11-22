-- Run with: npx supabase test db
begin;
select plan(10);

-- Fixtures (rolled back at the end).
insert into public.categories (id, name, sort_order)
values ('d0000000-0000-4000-8000-000000000001', 'Test category', 99);

insert into public.menu_items (id, category_id, name, price, is_available) values
  ('d1000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Test meal', 100.50, true),
  ('d1000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'Test sold out', 50, false);

update public.payment_methods set is_active = true where code = 'gcash';

select ok((select relrowsecurity from pg_class where oid = 'public.orders'::regclass), 'orders has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.order_items'::regclass), 'order_items has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.payment_methods'::regclass), 'payment_methods has RLS enabled');

set local role anon;
select throws_ok($$select * from public.orders$$, '42501', null, 'anon cannot read orders');
select throws_ok($$select * from public.payment_methods$$, '42501', null, 'anon cannot read payment methods');
select throws_ok(
  $$select * from public.create_order('Test User', '09171234567', 'takeout', '', '', 'gcash', '[]'::jsonb)$$,
  '42501', null, 'anon cannot call create_order'
);
reset role;

set local role service_role;
select is(
  (select o.total
   from public.create_order(
     'Test User', '09171234567', 'dine_in', '5', '', 'gcash',
     '[{"menu_item_id":"d1000000-0000-4000-8000-000000000001","quantity":2}]'::jsonb
   ) c
   join public.orders o on o.id = c.new_order_id),
  201.00,
  'the database prices the order'
);
select throws_ok(
  $$select * from public.create_order('Test User', '09170000000', 'takeout', '', '', 'gcash',
    '[{"menu_item_id":"d1000000-0000-4000-8000-000000000002","quantity":1}]'::jsonb)$$,
  'P0001', 'items_unavailable', 'a sold-out item is rejected'
);
select throws_ok(
  $$select * from public.create_order('Test User', '09170000000', 'takeout', '', '', 'gcash', '[]'::jsonb)$$,
  'P0001', 'invalid_items', 'an empty cart is rejected'
);
select throws_ok(
  $$select * from public.create_order('Test User', '09170000000', 'takeout', '', '', 'paypal',
    '[{"menu_item_id":"d1000000-0000-4000-8000-000000000001","quantity":1}]'::jsonb)$$,
  'P0001', 'invalid_payment_method', 'an unknown payment method is rejected'
);
reset role;

select * from finish();
rollback;
