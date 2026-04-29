import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroDefault from "@/assets/hero-ladakh.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, User, Hash, Calendar, Zap, BookOpen,
  Route, Hotel, Utensils, Bus, Tag, CreditCard, Check, X, ListChecks, MapPin, Sparkles, FileText,
} from "lucide-react";
import PayQRDialog from "@/components/PayQRDialog";
import type { Trip } from "@/lib/tripTypes";

const TripPage = () => {
  const { slug } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("trips")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setTrip(data as any);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading trip...</div>;
  }

  if (!trip) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card-elegant p-8 max-w-md text-center">
          <h1 className="heading-md">Trip not found</h1>
          <p className="text-muted-foreground mt-2">
            This trip link is invalid or has been removed.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </main>
    );
  }

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";
  const dateRange =
    trip.start_date && trip.end_date
      ? `${fmtDate(trip.start_date)} – ${fmtDate(trip.end_date)}`
      : trip.start_date
      ? fmtDate(trip.start_date)
      : "";
  const totalAmt = trip.total_cost ? `₹${trip.total_cost.toLocaleString("en-IN")}` : "";

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg shadow-soft py-3">
        <div className="container-custom flex items-center justify-between px-4 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="EasyTrip India" className="h-12 md:h-14 object-contain" />
          </a>
          <Button
            onClick={() => setQrOpen(true)}
            className="bg-gradient-primary text-secondary-foreground hover:opacity-90 shadow-elegant rounded-full px-6"
          >
            Pay Now
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-[100svh] flex items-end overflow-hidden">
        <img
          src={trip.hero_image || heroDefault}
          alt={trip.destination}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-primary/30" />

        <div className="relative container-custom w-full px-4 md:px-8 pb-16 md:pb-24 pt-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 border border-success/40 backdrop-blur-md mb-8">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-success">
                EasyTrip India · Government Registered
              </span>
            </div>
            <h1 className="text-white font-extrabold leading-[1.05] tracking-tight">
              <span className="block text-4xl md:text-6xl lg:text-7xl">{trip.destination}</span>
              {trip.num_days && (
                <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 bg-gradient-gold bg-clip-text text-transparent">
                  {trip.num_days} Days Journey
                </span>
              )}
            </h1>
            {trip.overview && (
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">{trip.overview}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Chip icon={<User className="w-4 h-4" />} text={trip.client_name} />
              <Chip icon={<Hash className="w-4 h-4" />} text={trip.slug.toUpperCase()} />
              {dateRange && <Chip icon={<Calendar className="w-4 h-4" />} text={dateRange} />}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                onClick={() => setQrOpen(true)}
                size="lg"
                className="bg-gradient-primary text-secondary-foreground hover:opacity-95 shadow-elegant rounded-full px-8 h-14 text-base font-semibold pulse-glow"
              >
                <Zap className="w-5 h-5 mr-1" /> Pay Now
              </Button>
              {trip.itinerary?.length > 0 && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-14 text-base font-semibold bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white backdrop-blur-md"
                >
                  <a href="#itinerary">
                    <BookOpen className="w-5 h-5 mr-1" /> View Itinerary
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      {trip.itinerary?.length > 0 && (
        <section id="itinerary" className="section-padding bg-gradient-soft">
          <div className="container-custom">
            <div className="section-label">
              <Route className="w-4 h-4" /> Day by Day
            </div>
            <h2 className="heading-lg mt-4">Your Complete Itinerary</h2>
            <div className="mt-14 relative">
              <div className="absolute left-4 md:left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-secondary via-secondary/40 to-transparent" />
              <div className="space-y-6">
                {trip.itinerary.map((d) => (
                  <div key={d.day} className="relative pl-14 md:pl-20">
                    <div className="absolute left-0 top-2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-primary flex items-center justify-center text-secondary-foreground font-bold text-sm md:text-base shadow-elegant">
                      {d.day}
                    </div>
                    <div className="card-elegant p-6 md:p-8">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
                          Day {d.day}
                        </span>
                        {d.date && <span className="text-sm text-muted-foreground font-medium">{d.date}</span>}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-primary">{d.title}</h3>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{d.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {d.hotel && <DayTag icon={<Hotel className="w-4 h-4" />} text={d.hotel} />}
                        {d.meals && (
                          <DayTag icon={<Utensils className="w-4 h-4" />} text={d.meals} variant="green" />
                        )}
                        {d.transport && <DayTag icon={<Bus className="w-4 h-4" />} text={d.transport} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hotels */}
      {trip.hotels?.length > 0 && (
        <section id="hotels" className="section-padding bg-background">
          <div className="container-custom">
            <div className="section-label">
              <Hotel className="w-4 h-4" /> Accommodation
            </div>
            <h2 className="heading-lg mt-4">Your Hotel Summary</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
              Hotels would be similar; reserved rights for EasyTrip India under unfamiliar circumstances.
            </p>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trip.hotels.map((h, i) => (
                <div key={i} className="card-elegant p-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-dark text-warning flex items-center justify-center">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="mt-5 text-xs font-bold uppercase tracking-widest text-secondary">{h.city}</div>
                  <div className="mt-2 text-lg font-bold text-primary">{h.name}</div>
                  {h.note && (
                    <div className="mt-3 text-sm text-muted-foreground">🍴 {h.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activities */}
      {trip.activities?.length > 0 && (
        <section className="section-padding bg-gradient-soft">
          <div className="container-custom">
            <div className="section-label">
              <Sparkles className="w-4 h-4" /> Experiences
            </div>
            <h2 className="heading-lg mt-4">Activities & Highlights</h2>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trip.activities.map((a, i) => (
                <div key={i} className="card-elegant p-5 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-primary font-medium">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cost */}
      {trip.total_cost && (
        <section className="relative section-padding bg-gradient-dark text-white overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-3xl" />
          <div className="container-custom relative text-center">
            <div className="inline-flex items-center gap-2 text-warning text-sm font-bold uppercase tracking-widest">
              <Tag className="w-4 h-4" /> Package Cost
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Total Package Value</h2>
            <div className="mt-8 text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-gold bg-clip-text text-transparent leading-none">
              {totalAmt}
            </div>
            <p className="mt-4 text-white/70">All inclusive · GST included</p>
          </div>
        </section>
      )}

      {/* Inclusions / Exclusions */}
      {(trip.inclusions?.length > 0 || trip.exclusions?.length > 0) && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="section-label">
              <ListChecks className="w-4 h-4" /> Inclusions & Exclusions
            </div>
            <h2 className="heading-lg mt-4">What's Included</h2>
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {trip.inclusions?.length > 0 && (
                <div className="card-elegant p-8 border-t-4 border-t-success">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-success/15 text-success flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">Inclusions</h3>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {trip.inclusions.map((i, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trip.exclusions?.length > 0 && (
                <div className="card-elegant p-8 border-t-4 border-t-destructive">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary">Exclusions</h3>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {trip.exclusions.map((i, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Payments */}
      {trip.payments?.length > 0 && (
        <section className="section-padding bg-gradient-soft">
          <div className="container-custom">
            <div className="section-label">
              <CreditCard className="w-4 h-4" /> Payment Details
            </div>
            <h2 className="heading-lg mt-4">Installment Schedule</h2>
            <div className="mt-10 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {trip.payments.map((p, i) => (
                  <div
                    key={i}
                    className="card-elegant p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 border-l-secondary"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-secondary/15 text-secondary font-bold">
                      {p.label?.charAt(0) || (i + 1).toString()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {p.label} Installment
                      </span>
                      <div className="mt-1 text-2xl font-extrabold text-primary">{p.amount}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {p.meta} {p.via && <span className="opacity-70">· {p.via}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:sticky lg:top-28 self-start">
                <div className="rounded-3xl bg-gradient-dark p-8 shadow-elegant text-white relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-warning/20 blur-3xl" />
                  <div className="relative">
                    <div className="text-xs uppercase tracking-widest text-white/60 font-semibold">
                      Total Amount
                    </div>
                    <div className="mt-2 text-5xl font-black bg-gradient-gold bg-clip-text text-transparent">
                      {totalAmt || "—"}
                    </div>
                    <Button
                      onClick={() => setQrOpen(true)}
                      size="lg"
                      className="mt-8 w-full bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-14 text-base font-semibold pulse-glow"
                    >
                      <Zap className="w-5 h-5 mr-1" /> Pay Now
                    </Button>
                    <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60 leading-relaxed">
                      Secure payments via UPI / Bank Transfer.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Notes */}
      {trip.notes && (
        <section className="section-padding bg-background">
          <div className="container-custom max-w-3xl">
            <div className="section-label">
              <FileText className="w-4 h-4" /> Special Instructions
            </div>
            <h2 className="heading-lg mt-4">Notes</h2>
            <div className="card-elegant p-6 md:p-8 mt-8 whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {trip.notes}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-dark text-white py-10 text-center">
        <div className="container-custom">
          <img src={logo} alt="EasyTrip India" className="h-12 mx-auto object-contain" />
          <p className="mt-4 text-white/70 text-sm">
            EasyTrip India · Government of India Registered · Maharashtra Tourism Recognized
          </p>
          <p className="mt-2 text-white/50 text-xs">© {new Date().getFullYear()} EasyTrip India</p>
        </div>
      </footer>

      <PayQRDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        amount={totalAmt}
        title={`Pay ${trip.client_name}`}
      />
    </main>
  );
};

const Chip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium">
    <span className="text-warning">{icon}</span>
    {text}
  </span>
);

const DayTag = ({ icon, text, variant }: { icon: React.ReactNode; text: string; variant?: "green" }) => (
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

export default TripPage;
