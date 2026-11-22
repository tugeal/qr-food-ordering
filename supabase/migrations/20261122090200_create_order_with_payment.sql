-- create_order now takes the payment method. Same rules as before: the browser sends only ids and
-- quantities, and every name and price comes from menu_items inside one transaction.

drop function public.create_order(text, text, public.order_type, text, text, jsonb);

create function public.create_order(
  p_customer_name   text,
  p_contact_number  text,
  p_order_type      public.order_type,
  p_table_number    text,
  p_instructions    text,
  p_payment_method  text,
  p_items           jsonb
)
returns table (new_order_id uuid, new_order_number integer)
language plpgsql
set search_path = ''
as $$
declare
  v_order_id      uuid;
  v_order_number  integer;
  v_subtotal      numeric(10, 2);
  v_problem_items text;
begin
  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'invalid_items' using errcode = 'P0001';
  end if;
  if jsonb_array_length(p_items) not between 1 and 30 then
    raise exception 'invalid_items' using errcode = 'P0001';
  end if;

  -- Throttle: at most 5 orders per phone number every 10 minutes.
  if (
    select count(*)
    from public.orders o
    where o.contact_number = p_contact_number
      and o.created_at > now() - interval '10 minutes'
  ) >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  -- The payment method must be one the restaurant has switched on.
  if not exists (
    select 1 from public.payment_methods pm where pm.code = p_payment_method and pm.is_active
  ) then
    raise exception 'invalid_payment_method' using errcode = 'P0001';
  end if;

  -- Every requested item must exist, be available and sit in an active category.
  select string_agg(coalesce(m.name, 'Unknown item'), ', ' order by m.name)
    into v_problem_items
  from public.parse_order_items(p_items) r
  left join public.menu_items m on m.id = r.menu_item_id
  left join public.categories c on c.id = m.category_id
  where m.id is null
     or not m.is_available
     or c.is_active is not true
     or r.quantity not between 1 and 20;

  if v_problem_items is not null then
    raise exception 'items_unavailable' using errcode = 'P0001', detail = v_problem_items;
  end if;

  insert into public.orders
    (customer_name, contact_number, order_type, table_number, instructions, payment_method, subtotal, total)
  values
    (p_customer_name, p_contact_number, p_order_type, nullif(p_table_number, ''), nullif(p_instructions, ''),
     p_payment_method, 0, 0)
  returning id, order_number into v_order_id, v_order_number;

  insert into public.order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
  select v_order_id, m.id, m.name, m.price, r.quantity, m.price * r.quantity
  from public.parse_order_items(p_items) r
  join public.menu_items m on m.id = r.menu_item_id;

  select sum(i.line_total) into v_subtotal from public.order_items i where i.order_id = v_order_id;

  update public.orders set subtotal = v_subtotal, total = v_subtotal where id = v_order_id;

  return query select v_order_id, v_order_number;
end;
$$;

-- Only the server (secret key) may create orders.
revoke execute on function public.create_order(text, text, public.order_type, text, text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.create_order(text, text, public.order_type, text, text, text, jsonb)
  to service_role;
