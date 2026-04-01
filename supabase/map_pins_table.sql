-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) to create the map_pins table and RLS policies.

create table if not exists public.map_pins (
  id uuid primary key default gen_random_uuid(),
  lat double precision not null,
  lng double precision not null,
  message text not null check (char_length(message) between 3 and 500),
  category text not null default 'thought',
  created_at timestamptz not null default now()
);

-- Index for fast bounding-box queries
create index if not exists idx_map_pins_coords on public.map_pins (lat, lng);

-- Enable RLS
alter table public.map_pins enable row level security;

-- Allow anonymous reads (anyone can see all pins)
create policy "Allow public reads"
  on public.map_pins
  for select
  to anon
  using (true);

-- Allow anonymous inserts (anyone can drop a pin)
create policy "Allow public inserts"
  on public.map_pins
  for insert
  to anon
  with check (true);
