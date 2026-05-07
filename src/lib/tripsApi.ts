import { supabase } from "@/integrations/supabase/client";
import type { Trip } from "./tripTypes";

export type TripInput = Omit<Trip, "id" | "created_at" | "updated_at">;

export async function listTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Trip[];
}

export async function getTrip(id: string): Promise<Trip | null> {
  const { data, error } = await supabase.from("trips").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as unknown as Trip | null;
}

export async function createTrip(input: TripInput): Promise<Trip> {
  const { data, error } = await supabase
    .from("trips")
    .insert(input as never)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Trip;
}

export async function updateTrip(id: string, input: Partial<TripInput>): Promise<Trip> {
  const { data, error } = await supabase
    .from("trips")
    .update(input as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Trip;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
}
