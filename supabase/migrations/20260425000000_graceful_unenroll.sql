-- Allow 'pending_cancel' as a valid enrollment status
-- First drop the old CHECK constraint, then re-add with new value
ALTER TABLE public.enrollments
  DROP CONSTRAINT IF EXISTS enrollments_status_check;

ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_status_check
  CHECK (status IN ('enrolled', 'waitlisted', 'pending_cancel'));

-- Column to track when a pending_cancel should be committed
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS cancel_at timestamptz;

-- Recreate the enrollment summary view to exclude pending_cancel rows
CREATE OR REPLACE VIEW public.workshop_enrollment_summary AS
SELECT
  workshop_id,
  count(*) FILTER (WHERE status = 'enrolled')   AS enrolled_count,
  count(*) FILTER (WHERE status = 'waitlisted') AS waitlisted_count
FROM public.enrollments
WHERE status != 'pending_cancel'
GROUP BY workshop_id;

GRANT SELECT ON public.workshop_enrollment_summary TO authenticated, anon;

-- Function: process expired pending_cancel enrollments
-- Deletes them and promotes the earliest waitlisted user for each freed slot
CREATE OR REPLACE FUNCTION process_pending_cancels()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rec RECORD;
BEGIN
  -- Loop over every expired pending_cancel that was originally 'enrolled'
  -- (waitlisted pending_cancels can just be deleted — no slot freed)
  FOR rec IN
    SELECT id, user_id, workshop_id
    FROM public.enrollments
    WHERE status = 'pending_cancel'
      AND cancel_at <= now()
  LOOP
    -- Delete the expired pending_cancel row
    DELETE FROM public.enrollments
    WHERE id = rec.id;

    -- Count currently enrolled users for this workshop to decide if a slot opened
    -- (we only promote if capacity allows — check against workshop capacity)
    UPDATE public.enrollments e
    SET status = 'enrolled', cancel_at = NULL
    WHERE e.workshop_id = rec.workshop_id
      AND e.status = 'waitlisted'
      AND e.user_id = (
        SELECT user_id
        FROM public.enrollments
        WHERE workshop_id = rec.workshop_id
          AND status = 'waitlisted'
        ORDER BY enrolled_at ASC
        LIMIT 1
      )
      -- Only promote if the workshop isn't already at capacity
      AND (
        SELECT count(*)
        FROM public.enrollments
        WHERE workshop_id = rec.workshop_id
          AND status = 'enrolled'
      ) < (
        SELECT capacity FROM public.workshops WHERE id = rec.workshop_id
      );
  END LOOP;
END;
$$;

-- Schedule: run every minute to process expired pending_cancels
SELECT cron.schedule(
  'process-pending-cancels',
  '* * * * *',
  'SELECT process_pending_cancels()'
);
