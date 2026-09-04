-- Church Schedule Keeper
-- Run this file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  time text not null,
  name_en text not null,
  name_ta text not null,
  location_en text not null default '',
  location_ta text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  title_en text not null,
  title_ta text not null,
  time_en text not null default '',
  time_ta text not null default '',
  location_en text not null default '',
  location_ta text not null default '',
  description_en text not null default '',
  description_ta text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
alter table public.schedule_items enable row level security;
alter table public.events enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and active = true
  );
$$;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "Admins can write site content" on public.site_content;
create policy "Admins can write site content"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read schedules" on public.schedule_items;
create policy "Public can read schedules"
on public.schedule_items for select
to anon, authenticated
using (true);

drop policy if exists "Admins can write schedules" on public.schedule_items;
create policy "Admins can write schedules"
on public.schedule_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
on public.events for select
to anon, authenticated
using (true);

drop policy if exists "Admins can write events" on public.events;
create policy "Admins can write events"
on public.events for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read own admin record" on public.admin_users;
create policy "Admins can read own admin record"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- After creating a user in Supabase Authentication, run:
-- insert into public.admin_users (user_id, display_name)
-- values ('AUTH_USER_UUID_HERE', 'Church Administrator');

-- Optional seed row. The application will also create the row when saving
-- if it does not exist.
insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
