-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) to create the feedback table and RLS policies.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  last_updated_at timestamptz not null default now(),
  type text not null,
  topics text[] default '{}',
  area text,
  area_other text,
  message text not null,
  email text,
  name text,
  status text not null default 'Received',
  public_notes text
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Allow anonymous inserts (form submissions)
create policy "Allow public inserts"
  on public.feedback
  for insert
  to anon
  with check (true);

-- Allow anonymous reads (for status lookup by reference)
create policy "Allow public reads"
  on public.feedback
  for select
  to anon
  using (true);
