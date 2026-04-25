-- Create private bucket for CVs
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

-- Users can upload/update their own CV
create policy "Users can upload own CV"
on storage.objects for insert
with check (
  bucket_id = 'cvs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update own CV"
on storage.objects for update
using (
  bucket_id = 'cvs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can read their own CV
create policy "Users can read own CV"
on storage.objects for select
using (
  bucket_id = 'cvs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own CV
create policy "Users can delete own CV"
on storage.objects for delete
using (
  bucket_id = 'cvs'
  and auth.uid()::text = (storage.foldername(name))[1]
);
