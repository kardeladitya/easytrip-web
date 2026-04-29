export type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  description: string;
  hotel?: string;
  meals?: string;
  transport?: string;
};

export type HotelEntry = {
  city: string;
  name: string;
  note?: string;
};

export type PaymentInst = {
  label: string;
  amount: string;
  meta?: string;
  via?: string;
};

export type Trip = {
  id: string;
  slug: string;
  client_name: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  num_days: number | null;
  budget: number | null;
  hero_image: string | null;
  overview: string | null;
  inclusions: string[];
  exclusions: string[];
  hotels: HotelEntry[];
  transport: { details?: string };
  itinerary: ItineraryDay[];
  activities: string[];
  payments: PaymentInst[];
  total_cost: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const emptyTrip = (): Omit<Trip, "id" | "created_at" | "updated_at"> => ({
  slug: "",
  client_name: "",
  destination: "",
  start_date: null,
  end_date: null,
  num_days: null,
  budget: null,
  hero_image: null,
  overview: null,
  inclusions: [],
  exclusions: [],
  hotels: [],
  transport: {},
  itinerary: [],
  activities: [],
  payments: [],
  total_cost: null,
  notes: null,
});

export const slugify = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${base || "client"}${rand}`;
};
