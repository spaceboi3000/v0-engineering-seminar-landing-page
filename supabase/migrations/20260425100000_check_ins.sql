-- Check-ins table: tracks physical attendance per context (entrance or workshop)
CREATE TABLE public.check_ins (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  context    text NOT NULL,                    -- 'entrance' or a workshop_id
  checked_at timestamptz NOT NULL DEFAULT now(),
  checked_by uuid REFERENCES auth.users,       -- admin who performed the scan
  UNIQUE (user_id, context)                    -- one check-in per context per user
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Only service role (admin APIs) can read/write check_ins
-- No authenticated user policies needed — all access goes through admin API routes
