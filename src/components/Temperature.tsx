import { Thermometer, Sun, Moon } from "lucide-react";

const Temperature = () => {
  return (
    <section id="climate" className="section-padding bg-gradient-soft">
      <div className="container-custom text-center">
        <div className="section-label justify-center inline-flex">
          <Thermometer className="w-4 h-4" /> Climate
        </div>
        <h2 className="heading-lg mt-4">Expected Temperature</h2>
        <p className="mt-3 text-muted-foreground text-lg">Pack accordingly for cold Himalayan nights.</p>

        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 bg-gradient-to-br from-warning/30 via-warning/10 to-background shadow-card border border-warning/20">
            <Sun className="w-14 h-14 mx-auto text-warning" />
            <div className="mt-6 text-5xl md:text-6xl font-black text-warning">10°C – 20°C</div>
            <div className="mt-3 text-primary font-semibold">Daytime Temperature</div>
          </div>
          <div className="rounded-3xl p-10 bg-gradient-dark text-white shadow-elegant border border-white/10">
            <Moon className="w-14 h-14 mx-auto text-warning" />
            <div className="mt-6 text-5xl md:text-6xl font-black text-warning">0°C – 8°C</div>
            <div className="mt-3 font-semibold">Nighttime (Can drop below 0°C)</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Temperature;
