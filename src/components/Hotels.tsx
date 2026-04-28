import { Hotel, Mountain, Snowflake, Castle, Wind, Waves } from "lucide-react";

const hotels = [
  { city: "Manali", name: "Hotel S.Nas Retreat", note: "MAP – Breakfast & Dinner", icon: <Mountain className="w-7 h-7" /> },
  { city: "Jispa", name: "Hotel Ibex Jispa", note: "Breakfast & Dinner", icon: <Snowflake className="w-7 h-7" /> },
  { city: "Leh – Ladakh", name: "Hinjuma Guest House", note: "Breakfast & Dinner", suffix: "or Similar", icon: <Castle className="w-7 h-7" /> },
  { city: "Nubra Valley", name: "Nubra Galaxy", note: "Breakfast & Dinner", icon: <Wind className="w-7 h-7" /> },
  { city: "Pangong", name: "The Golden Cottage", note: "Breakfast & Dinner", icon: <Waves className="w-7 h-7" /> },
];

const Hotels = () => {
  return (
    <section id="hotels" className="section-padding bg-background">
      <div className="container-custom">
        <div className="section-label">
          <Hotel className="w-4 h-4" /> Accommodation
        </div>
        <h2 className="heading-lg mt-4">Your Hotel Summary</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          All accommodations booked under EasyTrip India. 4 rooms on triple sharing basis.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hotels.map((h) => (
            <div key={h.city} className="card-elegant p-6 text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-dark text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
                {h.icon}
              </div>
              <div className="mt-5 text-xs font-bold uppercase tracking-widest text-secondary">{h.city}</div>
              <div className="mt-2 text-lg font-bold text-primary">
                {h.name}
                {h.suffix && <span className="font-normal text-muted-foreground text-sm"> {h.suffix}</span>}
              </div>
              <div className="mt-3 text-sm text-muted-foreground inline-flex items-center gap-1">
                🍴 {h.note}
              </div>
            </div>
          ))}
          <div className="card-elegant p-6 text-center bg-gradient-dark text-white border-none">
            <div className="text-4xl font-extrabold text-warning">4</div>
            <div className="mt-2 text-sm uppercase tracking-widest text-white/70">Rooms</div>
            <div className="mt-3 text-base font-semibold">Triple Sharing Basis</div>
            <div className="mt-1 text-xs text-white/60">Booked under EasyTrip India</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hotels;
