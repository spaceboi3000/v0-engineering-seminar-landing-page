-- Fix: allow upsert on cv_uploads by ensuring all required policies exist
-- The upsert (INSERT ... ON CONFLICT ... DO UPDATE) needs both INSERT and UPDATE
-- policies, plus SELECT to detect the conflict.

-- Drop existing policies to recreate them cleanly
drop policy if exists "cv_uploads: user select own" on public.cv_uploads;
drop policy if exists "cv_uploads: user insert own" on public.cv_uploads;
drop policy if exists "cv_uploads: user update own" on public.cv_uploads;

-- SELECT: needed for ON CONFLICT detection
create policy "cv_uploads: user select own"
  on public.cv_uploads for select
  using (auth.uid() = user_id);

-- INSERT: with check on the new row
create policy "cv_uploads: user insert own"
  on public.cv_uploads for insert
  with check (auth.uid() = user_id);

-- UPDATE: using + with check for the upsert path
create policy "cv_uploads: user update own"
  on public.cv_uploads for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: allow users to delete their own CV record
drop policy if exists "cv_uploads: user delete own" on public.cv_uploads;

create policy "cv_uploads: user delete own"
  on public.cv_uploads for delete
  using (auth.uid() = user_id);
