-- Sample data. Safe to run more than once.

insert into public.categories (id, name, sort_order) values
  ('c0000000-0000-4000-8000-000000000001', 'Meals',  1),
  ('c0000000-0000-4000-8000-000000000002', 'Snacks', 2),
  ('c0000000-0000-4000-8000-000000000003', 'Drinks', 3)
on conflict (id) do nothing;

insert into public.menu_items (id, category_id, name, description, price, emoji, is_available, sort_order) values
  ('10000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Chicken Adobo Rice',  'Soy-vinegar braised chicken with garlic rice',    149, '🍛', true,  1),
  ('10000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'Pork Sisig',          'Sizzling chopped pork with onion and calamansi', 169, '🥘', true,  2),
  ('10000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001', 'Beef Tapa Silog',     'Cured beef tapa, garlic rice and fried egg',     159, '🥩', true,  3),
  ('10000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001', 'Pancit Canton',       'Stir-fried noodles with vegetables',             129, '🍜', true,  4),
  ('10000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000002', 'Cheese Fries',        'Crispy fries with cheese sauce',                  89, '🍟', true,  5),
  ('10000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000002', 'Chicken Wings',       'Six pieces with garlic parmesan glaze',          159, '🍗', true,  6),
  ('10000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000002', 'Lumpiang Shanghai',   'Ten crispy pork rolls with sweet chili dip',      99, '🥟', true,  7),
  ('10000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000002', 'Turon',               'Banana and jackfruit in a caramelized wrapper',   59, '🍌', false, 8),
  ('10000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000003', 'Iced Tea',            'House-brewed and lightly sweet',                  49, '🥤', true,  9),
  ('10000000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000003', 'Calamansi Juice',     'Fresh-squeezed calamansi',                        59, '🍋', true,  10),
  ('10000000-0000-4000-8000-000000000011', 'c0000000-0000-4000-8000-000000000003', 'Iced Coffee',         'Cold brew with milk',                             89, '☕', true,  11),
  ('10000000-0000-4000-8000-000000000012', 'c0000000-0000-4000-8000-000000000003', 'Bottled Water',       '500 ml',                                          25, '💧', true,  12)
on conflict (id) do nothing;

insert into public.settings (key, value) values
  ('restaurant_name', 'Sample Kitchen'),
  ('site_url', '')
on conflict (key) do nothing;
