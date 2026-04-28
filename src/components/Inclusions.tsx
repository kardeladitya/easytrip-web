import { Check, X, ListChecks } from "lucide-react";

const inclusions = [
  "Accommodation at all destinations",
  "4 Rooms on Triple Sharing Basis",
  "Transportation as per itinerary",
  "Daily Breakfast & Dinner",
  "Chandigarh: 17 Seater Tempo Traveller",
  "Leh Sector: 12 Seater Tempo Traveller",
  "Basic First Aid Kit",
  "Driver cum Guide",
  "Fuel, tolls and parking charges",
  "24×7 EasyTrip India Support",
];

const exclusions = [
  "Entry fees / permits",
  "Airfare",
  "Activities / rides",
  "Travel insurance",
  "Heater / AC charges",
  "Lunch",
  "Personal expenses",
  "Tips",
  "Adventure activities",
];

const Inclusions = () => {
  return (
    <section id="inclusions" className="section-padding bg-background">
      <div className="container-custom">
        <div className="section-label">
          <ListChecks className="w-4 h-4" /> Inclusions & Exclusions
        </div>
        <h2 className="heading-lg mt-4">What's Included</h2>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card-elegant p-8 border-t-4 border-t-success">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/15 text-success flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Inclusions</h3>
            </div>
            <ul className="mt-6 space-y-3">
              {inclusions.map((i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elegant p-8 border-t-4 border-t-destructive">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Exclusions</h3>
            </div>
            <ul className="mt-6 space-y-3">
              {exclusions.map((i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inclusions;
