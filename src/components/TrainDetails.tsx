import { Train, ArrowRight, ArrowLeft, Calendar, Ticket, AlertTriangle } from "lucide-react";

const TrainDetails = () => {
  return (
    <section id="train" className="section-padding bg-background">
      <div className="container-custom">
        <div className="section-label">
          <Train className="w-4 h-4" /> Journey Details
        </div>
        <h2 className="heading-lg mt-4">Train Information</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          Your confirmed train bookings for onward and return journeys.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Onward */}
          <div className="card-elegant p-8 border-t-4 border-t-secondary">
            <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest">
              <ArrowRight className="w-4 h-4" /> Onward Journey
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mt-3">Paschim Express</h3>
            <p className="text-muted-foreground mt-1">Train No: 12925</p>

            <div className="mt-6 p-5 rounded-2xl bg-muted/60">
              <div className="flex items-center justify-between gap-2">
                <RouteStop name="Mumbai" sub="Departure" />
                <Connector />
                <RouteStop name="Chandigarh" sub="Deboard Here" highlight />
                <Connector dashed />
                <RouteStop name="Ludhiana" sub="Final Stop" muted />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Field label="Date" value="22 May 2026" icon={<Calendar className="w-4 h-4" />} />
              <Field label="Tickets Confirmed" value="12 Tickets ✓" icon={<Ticket className="w-4 h-4" />} />
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-warning/15 border border-warning/40">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-primary font-medium">
                Kindly deboard at <strong>Chandigarh</strong> — do NOT travel to Ludhiana.
              </p>
            </div>
          </div>

          {/* Return */}
          <div className="card-elegant p-8 border-t-4 border-t-primary">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Return Journey
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mt-3">Paschim Express</h3>
            <p className="text-muted-foreground mt-1">Train No: 12926</p>

            <div className="mt-6 p-5 rounded-2xl bg-muted/60">
              <div className="flex items-center justify-between gap-2">
                <RouteStop name="Chandigarh" sub="Departure" />
                <Connector />
                <RouteStop name="Bandra" sub="Terminus" highlight />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Field label="Departure" value="02 June · 12:20 PM" icon={<Calendar className="w-4 h-4" />} />
              <Field label="Arrival" value="03 June · 14:40 PM" icon={<Calendar className="w-4 h-4" />} />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-accent">
              <p className="text-sm text-accent-foreground font-medium">
                Arrival at Bandra Terminus, Mumbai. Please collect all belongings before deboarding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RouteStop = ({ name, sub, highlight, muted }: { name: string; sub: string; highlight?: boolean; muted?: boolean }) => (
  <div className="text-center">
    <div className={`text-sm md:text-base font-bold ${muted ? "text-muted-foreground" : highlight ? "text-secondary" : "text-primary"}`}>
      {name}
    </div>
    <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{sub}</div>
  </div>
);

const Connector = ({ dashed }: { dashed?: boolean }) => (
  <div className="flex-1 flex items-center justify-center relative h-[2px]">
    <div className={`w-full h-[2px] bg-secondary ${dashed ? "border-t-2 border-dashed border-muted-foreground bg-transparent" : ""}`} />
    <Train className="absolute w-5 h-5 text-secondary bg-muted/60 px-0.5" />
  </div>
);

const Field = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="p-4 rounded-xl bg-muted/40">
    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
      {icon} {label}
    </div>
    <div className="text-base font-bold text-primary mt-1">{value}</div>
  </div>
);

export default TrainDetails;
