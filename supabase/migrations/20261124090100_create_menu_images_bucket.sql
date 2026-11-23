-- Public bucket for food photos: anyone can view a photo, only the server (secret key) can
-- upload or delete. Size and file types are enforced here as well as in the app.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
