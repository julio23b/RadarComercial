-- Enable RLS
alter table public.commerces enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;

-- Public read for commerces
create policy "Public can read commerces"
  on public.commerces
  for select
  using (true);

-- Optional: only authenticated users can manage commerces (e.g. from admin panel)
create policy "Authenticated can insert commerces"
  on public.commerces
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update commerces"
  on public.commerces
  for update
  to authenticated
  using (true)
  with check (true);

-- Favorites: only owner can read/write/delete
create policy "Users can read their favorites"
  on public.favorites
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their favorites"
  on public.favorites
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their favorites"
  on public.favorites
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Reviews: public read, authenticated owner write/delete
-- NOTE: insert/update is gated by DB setting app.reviews_enabled = 'on'.
create policy "Public can read reviews"
  on public.reviews
  for select
  using (true);

create policy "Users can create reviews when enabled"
  on public.reviews
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and coalesce(current_setting('app.reviews_enabled', true), 'off') = 'on'
  );

create policy "Users can update own reviews when enabled"
  on public.reviews
  for update
  to authenticated
  using (
    auth.uid() = user_id
    and coalesce(current_setting('app.reviews_enabled', true), 'off') = 'on'
  )
  with check (
    auth.uid() = user_id
    and coalesce(current_setting('app.reviews_enabled', true), 'off') = 'on'
  );

create policy "Users can delete own reviews"
  on public.reviews
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Example to activate reviews:
-- alter database postgres set app.reviews_enabled = 'on';
