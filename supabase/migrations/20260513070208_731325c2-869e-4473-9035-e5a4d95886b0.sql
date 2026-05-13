
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS num_nights integer,
  ADD COLUMN IF NOT EXISTS about jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS transport_items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS checklist jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS guidelines jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS climate jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS tipping jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS terms text,
  ADD COLUMN IF NOT EXISTS payment_qr_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('trip-assets', 'trip-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Public read trip-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'trip-assets');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public upload trip-assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'trip-assets');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public update trip-assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'trip-assets');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public delete trip-assets"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'trip-assets');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
