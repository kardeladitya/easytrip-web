import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroDefault from "@/assets/hero-ladakh.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, User, Hash, Calendar, Zap, BookOpen,
  Route, Hotel, Utensils, Bus, Tag, CreditCard, Check, X, ListChecks, MapPin, Sparkles, FileText,
  Building2, Train, Ship, Car, Plane, Backpack, AlertTriangle, Thermometer, Sun, Moon, HandCoins,
} from "lucide-react";
import PayQRDialog from "@/components/PayQRDialog";
import type { Trip, TransportItem } from "@/lib/tripTypes";

const transportIcon = (type: string) => {
  switch ((type || "").toLowerCase()) {
    case "train": return <Train className="w-5 h-5" />;
    case "cruise": return <Ship className="w-5 h-5" />;
    case "cab": return <Car className="w-5 h-5" />;
    case "bus": return <Bus className="w-5 h-5" />;
    case "flight": return <Plane className="w-5 h-5" />;
    default: return <Bus className="w-5 h-5" />;
  }
};

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

  const durationLabel = (() => {
    const d = trip.num_days, n = trip.num_nights;
    if (d && n) return `${d} Days · ${n} Nights`;
    if (d) return `${d} Days Journey`;
    if (n) return `${n} Nights Journey`;
    return "";
  })();

  const hasAbout = !!(trip.about?.heading || trip.about?.body);
  const hasTransport = (trip.transport_items?.length ?? 0) > 0 || !!trip.transport?.details;
  const hasChecklist = (trip.checklist?.length ?? 0) > 0;
  const hasGuidelines = (trip.guidelines?.length ?? 0) > 0;
  const hasClimate = !!(trip.climate?.day_temp || trip.climate?.night_temp || trip.climate?.weather || trip.climate?.clothing || trip.climate?.notes);
  const hasTipping = !!(trip.tipping?.amount || trip.tipping?.notes || trip.tipping?.currency);
  const hasTerms = !!(trip.terms && trip.terms.trim());

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

      {/* 1. Trip Title (Hero) */}
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
              {durationLabel && (
                <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 bg-gradient-gold bg-clip-text text-transparent">
                  {durationLabel}
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

      {/* 2. About */}
      {hasAbout && (
        <section id="about" className="section-padding bg-gradient-soft">
          <div className="container-custom max-w-4xl">
            <div className="section-label">
              <Building2 className="w-4 h-4" /> About
            </div>
            <h2 className="heading-lg mt-4">{trip.about?.heading || "About Us"}</h2>
            {trip.about?.body && (
              <div className="mt-6 text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {trip.about.body}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Journey Details (hotels + activities + cost summary) */}
      {(trip.hotels?.length > 0 || trip.activities?.length > 0) && (
        <section id="journey" className="section-padding bg-background">
          <div className="container-custom">
            <div className="section-label">
              <MapPin className="w-4 h-4" /> Journey Details
            </div>
            <h2 className="heading-lg mt-4">Your Journey at a Glance</h2>

            {trip.hotels?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-primary mb-5">Hotels</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {trip.hotels.map((h, i) => (
                    <div key={i} className="card-elegant p-6 text-center">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-dark text-warning flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="mt-4 text-xs font-bold uppercase tracking-widest text-secondary">{h.city}</div>
                      <div className="mt-1.5 text-lg font-bold text-primary">{h.name}</div>
                      {h.note && <div className="mt-2 text-sm text-muted-foreground">🍴 {h.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trip.activities?.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-primary mb-5 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" /> Activities & Highlights
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trip.activities.map((a, i) => (
                    <div key={i} className="card-elegant p-5 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-primary font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Itinerary */}
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
                      <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-wrap">{d.description}</p>
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

      {/* 5. Transport Info */}
      {hasTransport && (
        <section id="transport" className="section-padding bg-background">
          <div className="container-custom">
            <div className="section-label">
              <Bus className="w-4 h-4" /> Transport Info
            </div>
            <h2 className="heading-lg mt-4">How You'll Travel</h2>
            {trip.transport?.details && (
              <p className="mt-3 text-muted-foreground text-lg max-w-2xl">{trip.transport.details}</p>
            )}
            {trip.transport_items?.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 gap-5">
                {(trip.transport_items as TransportItem[]).map((t, i) => (
                  <div key={i} className="card-elegant p-6 border-l-4 border-l-secondary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                        {transportIcon(t.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-widest text-secondary">{t.type}</span>
                          {t.timing && (
                            <span className="text-xs text-muted-foreground">· {t.timing}</span>
                          )}
                        </div>
                        {t.name && <div className="mt-1 text-lg font-bold text-primary">{t.name}</div>}
                        {t.details && <div className="mt-2 text-sm text-muted-foreground">{t.details}</div>}
                        {t.notes && (
                          <div className="mt-3 text-xs text-muted-foreground bg-accent/40 rounded-lg p-3">
                            {t.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. Must-Carry Checklist */}
      {hasChecklist && (
        <section id="checklist" className="section-padding bg-gradient-soft">
          <div className="container-custom">
            <div className="section-label">
              <Backpack className="w-4 h-4" /> Trip Essentials
            </div>
            <h2 className="heading-lg mt-4">Must-Carry Checklist</h2>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trip.checklist.map((g, i) => (
                <div key={i} className="card-elegant p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-primary text-secondary-foreground flex items-center justify-center">
                      <ListChecks className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-primary">{g.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {(g.items || []).filter(Boolean).map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1 w-4 h-4 rounded border-2 border-secondary flex items-center justify-center shrink-0">
                          <span className="block w-1.5 h-1.5 rounded-sm bg-secondary" />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Important Guidelines */}
      {hasGuidelines && (
        <section id="guidelines" className="section-padding bg-background">
          <div className="container-custom">
            <div className="section-label">
              <AlertTriangle className="w-4 h-4" /> Important Guidelines
            </div>
            <h2 className="heading-lg mt-4">Please Read Carefully</h2>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trip.guidelines.map((g, i) => (
                <div key={i} className="card-elegant p-6 bg-gradient-to-br from-warning/5 to-transparent border-l-4 border-l-warning">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <p className="text-primary font-medium leading-relaxed">{g.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Climate Information */}
      {hasClimate && (
        <section id="climate" className="section-padding bg-gradient-soft">
          <div className="container-custom">
            <div className="section-label">
              <Thermometer className="w-4 h-4" /> Climate
            </div>
            <h2 className="heading-lg mt-4">Climate Information</h2>

            {(trip.climate?.day_temp || trip.climate?.night_temp) && (
              <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-3xl">
                {trip.climate?.day_temp && (
                  <div className="rounded-3xl p-8 bg-gradient-to-br from-warning/30 via-warning/10 to-background shadow-card border border-warning/20 text-center">
                    <Sun className="w-12 h-12 mx-auto text-warning" />
                    <div className="mt-5 text-4xl md:text-5xl font-black text-warning">{trip.climate.day_temp}</div>
                    <div className="mt-3 text-primary font-semibold">Daytime Temperature</div>
                  </div>
                )}
                {trip.climate?.night_temp && (
                  <div className="rounded-3xl p-8 bg-gradient-dark text-white shadow-elegant border border-white/10 text-center">
                    <Moon className="w-12 h-12 mx-auto text-warning" />
                    <div className="mt-5 text-4xl md:text-5xl font-black text-warning">{trip.climate.night_temp}</div>
                    <div className="mt-3 font-semibold">Nighttime Temperature</div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {trip.climate?.weather && (
                <div className="card-elegant p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary">Weather</div>
                  <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{trip.climate.weather}</p>
                </div>
              )}
              {trip.climate?.clothing && (
                <div className="card-elegant p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary">Clothing</div>
                  <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{trip.climate.clothing}</p>
                </div>
              )}
              {trip.climate?.notes && (
                <div className="card-elegant p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary">Seasonal Notes</div>
                  <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{trip.climate.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. Tipping */}
      {hasTipping && (
        <section id="tipping" className="section-padding bg-background">
          <div className="container-custom max-w-3xl">
            <div className="section-label">
              <HandCoins className="w-4 h-4" /> Tipping
            </div>
            <h2 className="heading-lg mt-4">Tipping Information</h2>
            <div className="mt-8 card-elegant p-8 border-l-4 border-l-secondary">
              <div className="grid sm:grid-cols-2 gap-6">
                {trip.tipping?.currency && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-secondary">Currency</div>
                    <div className="mt-1 text-xl font-bold text-primary">{trip.tipping.currency}</div>
                  </div>
                )}
                {trip.tipping?.amount && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-secondary">Suggested Tip</div>
                    <div className="mt-1 text-xl font-bold text-primary">{trip.tipping.amount}</div>
                  </div>
                )}
              </div>
              {trip.tipping?.notes && (
                <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">{trip.tipping.notes}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Cost banner */}
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

      {/* 10. Terms & Important Notes */}
      {(hasTerms || trip.notes) && (
        <section id="terms" className="section-padding bg-background">
          <div className="container-custom max-w-3xl">
            <div className="section-label">
              <FileText className="w-4 h-4" /> Terms & Important Notes
            </div>
            <h2 className="heading-lg mt-4">Please Read Before You Travel</h2>
            {hasTerms && (
              <div className="card-elegant p-6 md:p-8 mt-8 whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {trip.terms}
              </div>
            )}
            {trip.notes && (
              <div className="card-elegant p-6 md:p-8 mt-6 whitespace-pre-wrap text-muted-foreground leading-relaxed">
                <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Special Instructions</div>
                {trip.notes}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 11. Footer */}
      <footer className="bg-gradient-dark text-white py-10 text-center">
        <div className="container-custom">
          <img
            src={logo}
            alt="EasyTrip India"
            className="h-16 mx-auto object-contain bg-white rounded-2xl p-2 inline-block"
          />
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
        qrUrl={trip.payment_qr_url}
      />
    </main>
  );
};

const Chip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-md">
    {icon}
    {text}
  </span>
);

const DayTag = ({
  icon,
  text,
  variant = "default",
}: {
  icon: React.ReactNode;
  text: string;
  variant?: "default" | "green";
}) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
      variant === "green"
        ? "bg-success/15 text-success"
        : "bg-accent text-accent-foreground"
    }`}
  >
    {icon}
    {text}
  </span>
);

export default TripPage;
