-- Allow company members to register: add role, company, position columns
-- and relax the year constraint to allow NULL for non-student registrations.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position text;

-- Drop the existing CHECK constraint on year to allow NULL for company members
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_year_check;
ALTER TABLE public.profiles ALTER COLUMN year DROP NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_year_check
  CHECK (
    (role = 'student' AND year IN ('1ο', '2ο', '3ο', '4ο', '5ο', '6ο+'))
    OR (role = 'company' AND year IS NULL)
  );
