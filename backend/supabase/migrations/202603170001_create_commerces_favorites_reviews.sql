-- Core marketplace tables
create extension if not exists pgcrypto;

create table if not exists public.commerces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  address text,
  city text,
  lat double precision,
  lng double precision,
  search_index tsvector generated always as (
    to_tsvector(
      'spanish',
      coalesce(name, '') || ' ' || coalesce(category, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, '')
    )
  ) stored,
  created_at timestamptz not null default now()
);

create index if not exists commerces_search_idx on public.commerces using gin(search_index);
create index if not exists commerces_city_idx on public.commerces(city);
create index if not exists commerces_category_idx on public.commerces(category);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  commerce_id uuid not null references public.commerces(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, commerce_id)
);

create index if not exists favorites_user_idx on public.favorites(user_id);
create index if not exists favorites_commerce_idx on public.favorites(commerce_id);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  commerce_id uuid not null references public.commerces(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_commerce_idx on public.reviews(commerce_id);
create index if not exists reviews_user_idx on public.reviews(user_id);
