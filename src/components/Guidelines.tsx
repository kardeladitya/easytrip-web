import { AlertTriangle, Mountain, Droplets, Ban, Utensils, Compass, HeartPulse } from "lucide-react";

const guidelines = [
  { icon: <Mountain className="w-5 h-5" />, text: "Acclimatization is very important — avoid exertion in the first 24-48 hours." },
  { icon: <Droplets className="w-5 h-5" />, text: "Stay hydrated. Drink plenty of water throughout the day." },
  { icon: <Ban className="w-5 h-5" />, text: "Avoid alcohol and smoking during the first few days at altitude." },
  { icon: <Utensils className="w-5 h-5" />, text: "Eat light meals regularly — heavy food digests slowly at high altitude." },
  { icon: <Compass className="w-5 h-5" />, text: "Always follow the instructions of your trip captain on the ground." },
  { icon: <HeartPulse className="w-5 h-5" />, text: "Inform our team immediately in case of any discomfort or symptoms." },
];

const Guidelines = () => {
  return (
    <section id="guidelines" className="section-padding bg-background">
      <div className="container-custom">
        <div className="section-label">
          <AlertTriangle className="w-4 h-4" /> Important Guidelines
        </div>
        <h2 className="heading-lg mt-4">Ladakh Travel Guidelines</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          For first-timers — please read carefully before your journey.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guidelines.map((g, i) => (
            <div key={i} className="card-elegant p-6 bg-gradient-to-br from-warning/5 to-transparent border-l-4 border-l-warning">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0">
                  {g.icon}
                </div>
                <p className="text-primary font-medium leading-relaxed">{g.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guidelines;
