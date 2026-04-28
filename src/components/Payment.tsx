import { useState } from "react";
import { CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayQRDialog from "./PayQRDialog";

type Inst = {
  no: string;
  amount: string;
  meta: string;
  via?: string;
};

const installments: Inst[] = [
  { no: "1st", amount: "₹90,000", meta: "12 February 2026 · 1:14 PM", via: "UPI to Megha Bagore" },
  { no: "2nd", amount: "₹58,000", meta: "16 April 2026 · 3:11 PM", via: "UPI to Megha Bagore" },
  { no: "3rd", amount: "₹70,000", meta: "Due 10 May 2026" },
  { no: "4th", amount: "₹1,50,000", meta: "On Arrival", via: "Vehicle, tolls & hotel expenses" },
  { no: "5th", amount: "₹42,000", meta: "During the Tour", via: "Balance payment" },
];

const Payment = () => {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <section id="payment" className="section-padding bg-gradient-soft">
      <div className="container-custom">
        <div className="section-label">
          <CreditCard className="w-4 h-4" /> Payment Details
        </div>
        <h2 className="heading-lg mt-4">Installment Schedule</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          Transparent payment breakdown across 5 installments.
        </p>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {installments.map((i) => (
              <div
                key={i.no}
                className="card-elegant p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 border-l-secondary"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-secondary/15 text-secondary font-bold">
                  {i.no.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {i.no} Installment
                    </span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-primary">{i.amount}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {i.meta} {i.via && <span className="opacity-70">· {i.via}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky summary */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="rounded-3xl bg-gradient-dark p-8 shadow-elegant text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-warning/20 blur-3xl" />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest text-white/60 font-semibold">Total Amount</div>
                <div className="mt-2 text-5xl font-black bg-gradient-gold bg-clip-text text-transparent">
                  ₹2,62,000
                </div>
                <div className="mt-1 text-sm text-white/60">across 3 remaining installments</div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={() => setQrOpen(true)}
                    size="lg"
                    className="w-full bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-14 text-base font-semibold pulse-glow"
                  >
                    <Zap className="w-5 h-5 mr-1" /> Pay Now
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60 leading-relaxed">
                  Secure payments processed via UPI / Bank Transfer. Receipt will be shared on confirmation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PayQRDialog open={qrOpen} onOpenChange={setQrOpen} amount="₹2,62,000" title="Pay Total Amount" />
    </section>
  );
};

export default Payment;
