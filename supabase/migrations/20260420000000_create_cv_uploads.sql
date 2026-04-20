-- Track CV upload metadata (one record per user, upserted on every re-upload)
create table public.cv_uploads (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users on delete cascade,
  file_path          text        not null,
  original_filename  text        not null,
  file_size_bytes    integer     not null,
  uploaded_at        timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id)
);

alter table public.cv_uploads enable row level security;

-- Users can read their own record
create policy "cv_uploads: user select own"
  on public.cv_uploads for select
  using (auth.uid() = user_id);

-- Users can insert their own record
create policy "cv_uploads: user insert own"
  on public.cv_uploads for insert
  with check (auth.uid() = user_id);

-- Users can update their own record (re-upload)
create policy "cv_uploads: user update own"
  on public.cv_uploads for update
  using (auth.uid() = user_id);
