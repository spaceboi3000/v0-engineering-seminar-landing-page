-- Add capacity to workshops
alter table public.workshops add column capacity integer not null default 30;

-- Set realistic capacities for the seeded workshops
update public.workshops set capacity = 30 where type = 'workshop';

-- Add status to enrollments
alter table public.enrollments
  add column status text not null default 'enrolled'
  check (status in ('enrolled', 'waitlisted'));

-- Public view: enrollment counts per workshop (no user data exposed)
create view public.workshop_enrollment_summary as
select
  workshop_id,
  count(*) filter (where status = 'enrolled')   as enrolled_count,
  count(*) filter (where status = 'waitlisted') as waitlisted_count
from public.enrollments
group by workshop_id;

grant select on public.workshop_enrollment_summary to authenticated, anon;
