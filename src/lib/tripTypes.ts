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

export type TransportItem = {
  type: string; // Train / Cruise / Cab / Bus / Flight
  name?: string; // e.g. flight no / train name
  timing?: string;
  details?: string;
  notes?: string;
};

export type ChecklistGroup = {
  title: string;
  items: string[];
};

export type GuidelineItem = {
  text: string;
};

export type ClimateInfo = {
  day_temp?: string;
  night_temp?: string;
  weather?: string;
  clothing?: string;
  notes?: string;
};

export type TippingInfo = {
  currency?: string;
  amount?: string;
  notes?: string;
};

export type AboutInfo = {
  heading?: string;
  body?: string;
};

export type Trip = {
  id: string;
  slug: string;
  client_name: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  num_days: number | null;
  num_nights: number | null;
  budget: number | null;
  hero_image: string | null;
  overview: string | null;
  about: AboutInfo;
  inclusions: string[];
  exclusions: string[];
  hotels: HotelEntry[];
  transport: { details?: string };
  transport_items: TransportItem[];
  itinerary: ItineraryDay[];
  activities: string[];
  checklist: ChecklistGroup[];
  guidelines: GuidelineItem[];
  climate: ClimateInfo;
  tipping: TippingInfo;
  terms: string | null;
  payments: PaymentInst[];
  payment_qr_url: string | null;
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
  num_nights: null,
  budget: null,
  hero_image: null,
  overview: null,
  about: {},
  inclusions: [],
  exclusions: [],
  hotels: [],
  transport: {},
  transport_items: [],
  itinerary: [],
  activities: [],
  checklist: [],
  guidelines: [],
  climate: {},
  tipping: {},
  terms: null,
  payments: [],
  payment_qr_url: null,
  total_cost: null,
  notes: null,
});

export const slugify = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${base || "client"}${rand}`;
};
