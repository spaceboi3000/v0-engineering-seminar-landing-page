-- Add assignable group column to profiles
-- Admins set this via Supabase dashboard; defaults to 'Not set'
alter table public.profiles
  add column if not exists assigned_group text not null default 'Not set'
  check (assigned_group in ('Not set', 'A', 'B'));
