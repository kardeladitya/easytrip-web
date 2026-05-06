-- Replace public write policies on trips with admin-only ones
DROP POLICY IF EXISTS "Public can insert trips" ON public.trips;
DROP POLICY IF EXISTS "Public can update trips" ON public.trips;
DROP POLICY IF EXISTS "Public can delete trips" ON public.trips;

CREATE POLICY "Admins can insert trips"
ON public.trips FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update trips"
ON public.trips FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete trips"
ON public.trips FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));