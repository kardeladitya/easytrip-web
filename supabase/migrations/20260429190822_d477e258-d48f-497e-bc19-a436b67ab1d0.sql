-- Allow public CRUD on trips since admin access is gated client-side via secret URL + password.
-- Auth-based admin policies are no longer used.
DROP POLICY IF EXISTS "Admins can delete trips" ON public.trips;
DROP POLICY IF EXISTS "Admins can update trips" ON public.trips;
DROP POLICY IF EXISTS "Admins can insert trips" ON public.trips;

CREATE POLICY "Public can insert trips"
ON public.trips FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update trips"
ON public.trips FOR UPDATE
USING (true);

CREATE POLICY "Public can delete trips"
ON public.trips FOR DELETE
USING (true);