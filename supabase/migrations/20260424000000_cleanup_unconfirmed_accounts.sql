-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role (required by Supabase)
GRANT USAGE ON SCHEMA cron TO postgres;

-- Create cleanup function: deletes accounts that haven't confirmed email after 24 hours
CREATE OR REPLACE FUNCTION delete_unconfirmed_accounts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.profiles
  WHERE id IN (
    SELECT id FROM auth.users
    WHERE email_confirmed_at IS NULL
      AND created_at < now() - interval '24 hours'
  );

  DELETE FROM auth.users
  WHERE email_confirmed_at IS NULL
    AND created_at < now() - interval '24 hours';
$$;

-- Schedule hourly cleanup (runs at minute 0 of every hour)
SELECT cron.schedule(
  'delete-unconfirmed-accounts',
  '0 * * * *',
  'SELECT delete_unconfirmed_accounts()'
);
