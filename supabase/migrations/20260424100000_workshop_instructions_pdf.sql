-- Add instructions PDF URL column to workshops
ALTER TABLE public.workshops ADD COLUMN instructions_url text;

-- Create public bucket for workshop instruction PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('workshop-instructions', 'workshop-instructions', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (public bucket)
CREATE POLICY "Public read workshop instructions"
ON storage.objects FOR SELECT
USING (bucket_id = 'workshop-instructions');

-- Only service role can write (handled via API route, no RLS needed for inserts)
