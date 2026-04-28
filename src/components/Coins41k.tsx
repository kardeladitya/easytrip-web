import { Coins, Sparkles } from "lucide-react";

const Coins41k = () => {
  return (
    <section id="coins" className="section-padding bg-background">
      <div className="container-custom">
        <div className="rounded-3xl bg-gradient-dark text-white p-10 md:p-16 shadow-elegant relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-warning/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-warning text-sm font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> Loyalty Reward
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-extrabold">EasyTrip Coins</h2>
              <p className="mt-4 text-white/70 text-lg max-w-xl">
                Welcome to the EasyTrip India family, Mr. Amit Sutar! As a thank-you, you've earned
                <strong className="text-warning"> 10% of your package value back</strong> as EasyTrip Coins.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Redeemable on your next bookings with EasyTrip India",
                  "Valid for next 10 bookings only",
                  "Conversion: 5 Coins = ₹1",
                  "Can be partially adjusted across multiple trips",
                  "Cannot be fully used in a single booking of same value",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-white/80">
                    <Sparkles className="w-4 h-4 text-warning shrink-0 mt-1" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-gold shadow-gold mb-6">
                <Coins className="w-16 h-16 md:w-20 md:h-20 text-primary" />
              </div>
              <div className="text-sm uppercase tracking-widest text-white/60 font-semibold">You've Earned</div>
              <div className="mt-2 text-6xl md:text-7xl font-black bg-gradient-gold bg-clip-text text-transparent">
                ₹41,000
              </div>
              <div className="mt-1 text-white/70">in EasyTrip Coins</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coins41k;
