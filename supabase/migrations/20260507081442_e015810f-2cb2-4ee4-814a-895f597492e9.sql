DROP POLICY IF EXISTS "Admins can insert trips" ON public.trips;
DROP POLICY IF EXISTS "Admins can update trips" ON public.trips;
DROP POLICY IF EXISTS "Admins can delete trips" ON public.trips;

CREATE POLICY "Public can insert trips" ON public.trips FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update trips" ON public.trips FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete trips" ON public.trips FOR DELETE TO anon, authenticated USING (true);