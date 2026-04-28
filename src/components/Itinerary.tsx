import { Route, Hotel, Utensils, Bus } from "lucide-react";

type Day = {
  day: number;
  date: string;
  title: string;
  description: string;
  hotel?: string;
  meals?: string;
  transport?: string;
};

const days: Day[] = [
  { day: 1, date: "22 May 2026", title: "Mumbai to Chandigarh (Train Journey)", description: "Board Paschim Express from Mumbai. Overnight journey towards Chandigarh.", meals: "On Own", transport: "Paschim Express" },
  { day: 2, date: "23 May 2026", title: "Arrival Chandigarh – Transfer to Manali", description: "Arrive at Chandigarh and meet our representative. Enjoy a scenic drive through the Himalayan foothills towards Manali. Check-in at hotel, followed by dinner and overnight stay.", hotel: "Hotel S.Nas Retreat, Manali", meals: "Breakfast & Dinner", transport: "17 Seater Tempo" },
  { day: 3, date: "24 May 2026", title: "Full Day Local Sightseeing – Manali", description: "After breakfast, proceed for full-day local sightseeing. Explore temples, hot water springs, old town areas, cafes, markets and leisure points. Hadimba Devi Temple, Vashisht Springs, Mall Road. Evening return to hotel.", hotel: "Hotel S.Nas Retreat, Manali", meals: "Breakfast & Dinner" },
  { day: 4, date: "25 May 2026", title: "Manali to Jispa via Atal Tunnel", description: "Post breakfast, drive through the high altitude Atal Tunnel and scenic valley landscapes. Witness stunning waterfalls, rivers and snow-covered mountains of Lahaul Valley. Reach Jispa by evening.", hotel: "Hotel Ibex Jispa", meals: "Breakfast & Dinner" },
  { day: 5, date: "26 May 2026", title: "Jispa to Leh – High Altitude Drive", description: "Early morning drive through high altitude routes with multiple scenic halts for acclimatization. Experience raw mountain terrain and dramatic Ladakh landscapes. Cross high mountain passes. Reach Leh by evening.", hotel: "Hinjuma Guest House, Leh", meals: "Breakfast & Dinner" },
  { day: 6, date: "27 May 2026", title: "Leh Local Sightseeing & Acclimatization", description: "After breakfast, explore local monasteries, stunning viewpoints, Indus-Zanskar river confluence and local markets. Optional adventure activities can be arranged at additional cost. Rest and acclimatize.", hotel: "Hinjuma Guest House, Leh", meals: "Breakfast & Dinner" },
  { day: 7, date: "28 May 2026", title: "Drive to Nubra Valley", description: "Drive through one of the world's highest motorable passes. Enjoy breathtaking panoramic mountain views and cold desert landscapes unique to Nubra. Evening arrival and relaxation at the camp.", hotel: "Nubra Galaxy", meals: "Breakfast & Dinner" },
  { day: 8, date: "29 May 2026", title: "Drive to Pangong Lake Region", description: "After breakfast, proceed towards the iconic high altitude lake region. Spend time soaking in the serene, crystal blue waters and peaceful mountain surroundings that make Pangong unforgettable.", hotel: "The Golden Cottage and Restaurant", meals: "Breakfast & Dinner" },
  { day: 9, date: "30 May 2026", title: "Return to Leh", description: "Drive back to Leh enjoying mountain views and scenic landscapes. Evening at leisure to explore local cafes and markets at your own pace.", hotel: "Hinjuma Guest House, Leh", meals: "Breakfast & Dinner" },
  { day: 10, date: "31 May 2026", title: "Leh to Manali", description: "Early morning departure via high altitude roads and scenic valleys. A long but breathtakingly beautiful journey across some of India's most dramatic landscapes. Arrival in Manali by evening.", hotel: "Hotel S.Nas Retreat, Manali", meals: "Breakfast & Dinner" },
  { day: 11, date: "01 June 2026", title: "Leisure Day – Manali", description: "Full day free for relaxation or optional activities. Explore surroundings at your own pace, visit nearby cafes, or simply unwind in the mountain ambience.", hotel: "Hotel S.Nas Retreat, Manali", meals: "Breakfast & Dinner" },
  { day: 12, date: "02 June 2026", title: "Manali to Chandigarh – Train Departure", description: "After breakfast, proceed for your return journey to Chandigarh. Drive enroute through scenic Himalayan mountains, river valleys and winding hill roads, enjoying the last glimpses of this beautiful region. Drop at railway station. Train: Paschim Express 12926 · Departure: 12:20 PM.", meals: "Breakfast", transport: "Paschim Express 12926" },
  { day: 13, date: "03 June 2026", title: "Arrival Mumbai", description: "Arrival at Bandra Terminus at 14:40 PM. Tour concludes with memorable experiences.", meals: "On Own" },
];

const Itinerary = () => {
  return (
    <section id="itinerary" className="section-padding bg-gradient-soft">
      <div className="container-custom">
        <div className="section-label">
          <Route className="w-4 h-4" /> Day by Day
        </div>
        <h2 className="heading-lg mt-4">Your Complete Itinerary</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          13 days of curated adventure across the Himalayas.
        </p>

        <div className="mt-14 relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-secondary via-secondary/40 to-transparent" />

          <div className="space-y-6">
            {days.map((d) => (
              <div key={d.day} className="relative pl-14 md:pl-20">
                {/* Day badge */}
                <div className="absolute left-0 top-2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-primary flex items-center justify-center text-secondary-foreground font-bold text-sm md:text-base shadow-elegant">
                  {d.day}
                </div>

                <div className="card-elegant p-6 md:p-8">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
                      Day {d.day}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">{d.date}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary">{d.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{d.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {d.hotel && <Tag icon={<Hotel className="w-4 h-4" />} text={d.hotel} />}
                    {d.meals && <Tag icon={<Utensils className="w-4 h-4" />} text={d.meals} variant="green" />}
                    {d.transport && <Tag icon={<Bus className="w-4 h-4" />} text={d.transport} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Tag = ({ icon, text, variant }: { icon: React.ReactNode; text: string; variant?: "green" }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold border ${
      variant === "green"
        ? "bg-secondary/10 text-secondary border-secondary/30"
        : "bg-muted text-primary border-border"
    }`}
  >
    {icon}
    {text}
  </span>
);

export default Itinerary;
