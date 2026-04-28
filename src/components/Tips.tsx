import { HandCoins, Heart } from "lucide-react";
import qr from "@/assets/upi-qr.jpeg";

const Tips = () => {
  return (
    <section id="tips" className="section-padding bg-background">
      <div className="container-custom">
        <div className="rounded-3xl bg-gradient-to-br from-secondary/10 via-background to-warning/5 p-8 md:p-14 border border-secondary/20 shadow-card relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="w-20 h-20 rounded-3xl bg-gradient-primary text-secondary-foreground flex items-center justify-center shadow-elegant">
              <HandCoins className="w-10 h-10" />
            </div>
            <div>
              <div className="section-label">
                <Heart className="w-4 h-4" /> Tipping
              </div>
              <h2 className="heading-md mt-3">Tipping is Completely Optional</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
                Tipping is not mandatory — you may choose to tip based on your satisfaction and preference.
                We never force it.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed text-lg">
                If you wish, you can contribute a tip which we will help distribute fairly among
                <strong className="text-primary"> chefs, waiters, hotel staff and drivers</strong> who make
                your trip successful. From kitchen staff to drivers, everyone benefits.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed text-lg">
                <strong className="text-primary">EasyTrip India does not take any share</strong> from this — we only
                assist in proper distribution. You may also tip directly if you prefer.
              </p>

              <div className="mt-8 grid sm:grid-cols-[auto_1fr] gap-6 items-center bg-card rounded-2xl p-6 border border-border shadow-card">
                <img
                  src={qr}
                  alt="UPI QR code to tip the EasyTrip India team"
                  className="w-44 h-auto rounded-xl mx-auto sm:mx-0"
                />
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Scan to Tip
                  </div>
                  <div className="mt-1 text-xl font-bold text-primary">Any UPI App Works</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    UPI ID: <span className="font-semibold text-foreground">9356914328@ptsbi</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Paytm · PhonePe · GPay · BHIM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tips;
