create table if not exists public.search_interaction_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid,
  event_type text not null check (event_type in ('view', 'click', 'favorite', 'unfavorite')),
  commerce_id text not null,
  query_text text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_search_interaction_events_created_at
  on public.search_interaction_events (created_at desc);
create index if not exists idx_search_interaction_events_commerce
  on public.search_interaction_events (commerce_id);
create index if not exists idx_search_interaction_events_query
  on public.search_interaction_events (query_text);

create table if not exists public.search_interaction_daily_agg (
  day date not null,
  commerce_id text not null,
  views int not null default 0,
  clicks int not null default 0,
  favorites int not null default 0,
  primary key (day, commerce_id)
);

create or replace function public.refresh_search_interaction_daily_agg(target_day date default current_date)
returns void
language plpgsql
as $$
begin
  insert into public.search_interaction_daily_agg (day, commerce_id, views, clicks, favorites)
  select
    target_day as day,
    commerce_id,
    count(*) filter (where event_type = 'view') as views,
    count(*) filter (where event_type = 'click') as clicks,
    count(*) filter (where event_type = 'favorite') -
      count(*) filter (where event_type = 'unfavorite') as favorites
  from public.search_interaction_events
  where created_at >= target_day::timestamptz
    and created_at < (target_day + interval '1 day')::timestamptz
  group by commerce_id
  on conflict (day, commerce_id) do update
  set views = excluded.views,
      clicks = excluded.clicks,
      favorites = excluded.favorites;
end;
$$;
