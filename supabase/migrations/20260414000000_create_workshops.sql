-- Workshops (seeded with placeholder schedule — update titles/times when real schedule is ready)
create table public.workshops (
  id        text primary key,
  title     text not null,
  speaker   text,
  location  text not null,
  type      text not null check (type in ('workshop', 'seminar', 'break', 'networking')),
  start_time timestamptz not null,
  end_time   timestamptz not null
);

insert into public.workshops (id, title, speaker, location, type, start_time, end_time) values
  ('1', 'Registration & Breakfast',       null,              'Main Lobby',      'break',       '2026-04-25 09:00:00+03', '2026-04-25 09:30:00+03'),
  ('2', 'Opening Keynote',                'Dr. Sarah Chen',  'Hall A',          'seminar',     '2026-04-25 09:30:00+03', '2026-04-25 10:00:00+03'),
  ('3', 'React Workshop',                 'Marcus Rivera',   'Room 201',        'workshop',    '2026-04-25 10:00:00+03', '2026-04-25 11:30:00+03'),
  ('4', 'Networking Session',             null,              'Rooftop Terrace', 'networking',  '2026-04-25 11:30:00+03', '2026-04-25 12:00:00+03'),
  ('5', 'Lunch Break',                    null,              'Dining Hall',     'break',       '2026-04-25 12:00:00+03', '2026-04-25 13:00:00+03'),
  ('6', 'AI & Machine Learning Seminar',  'Prof. James Liu', 'Hall B',          'seminar',     '2026-04-25 13:00:00+03', '2026-04-25 14:30:00+03'),
  ('7', 'Design Systems Workshop',        'Elena Kowalski',  'Room 305',        'workshop',    '2026-04-25 14:45:00+03', '2026-04-25 16:15:00+03');

-- Enrollments
create table public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  workshop_id text references public.workshops on delete cascade not null,
  enrolled_at timestamptz not null default now(),
  unique (user_id, workshop_id)
);

alter table public.enrollments enable row level security;

create policy "users can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "users can enroll"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy "users can unenroll"
  on public.enrollments for delete
  using (auth.uid() = user_id);
