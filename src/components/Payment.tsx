import { useState } from "react";
import { CreditCard, CheckCircle2, Clock, Zap, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayQRDialog from "./PayQRDialog";

type Inst = {
  no: string;
  amount: string;
  status: "paid" | "pending";
  meta: string;
  via?: string;
};

const installments: Inst[] = [
  { no: "1st", amount: "₹90,000", status: "paid", meta: "12 February 2026 · 1:14 PM", via: "UPI to Megha Bagore" },
  { no: "2nd", amount: "₹58,000", status: "paid", meta: "16 April 2026 · 3:11 PM", via: "UPI to Megha Bagore" },
  { no: "3rd", amount: "₹70,000", status: "pending", meta: "Due 10 May 2026", via: "Pay Now" },
  { no: "4th", amount: "₹1,50,000", status: "pending", meta: "On Arrival", via: "Vehicle, tolls & hotel expenses" },
  { no: "5th", amount: "₹42,000", status: "pending", meta: "During the Tour", via: "Balance payment" },
];

const Payment = () => {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrAmount, setQrAmount] = useState<string | undefined>(undefined);
  const [qrTitle, setQrTitle] = useState("Scan to Pay");

  const openQR = (amount?: string, title = "Scan to Pay") => {
    setQrAmount(amount);
    setQrTitle(title);
    setQrOpen(true);
  };

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
                className={`card-elegant p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 ${
                  i.status === "paid" ? "border-l-success" : "border-l-warning"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    i.status === "paid" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                  }`}
                >
                  {i.status === "paid" ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {i.no} Installment
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        i.status === "paid"
                          ? "bg-success text-success-foreground"
                          : "bg-warning text-warning-foreground"
                      }`}
                    >
                      {i.status === "paid" ? "Successful" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-primary">{i.amount}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {i.meta} {i.via && <span className="opacity-70">· {i.via}</span>}
                  </div>
                </div>

                {i.status === "pending" && (
                  <Button
                    onClick={() => openQR(i.amount, `Pay ${i.no} Installment`)}
                    className="bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full shrink-0"
                  >
                    <Zap className="w-4 h-4 mr-1" /> Pay Now
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Sticky summary */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="rounded-3xl bg-gradient-dark p-8 shadow-elegant text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-warning/20 blur-3xl" />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest text-white/60 font-semibold">Total Pending</div>
                <div className="mt-2 text-5xl font-black bg-gradient-gold bg-clip-text text-transparent">
                  ₹2,62,000
                </div>
                <div className="mt-1 text-sm text-white/60">across 3 remaining installments</div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={() => openQR("₹70,000", "Pay Next Installment")}
                    size="lg"
                    className="w-full bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-14 text-base font-semibold pulse-glow"
                  >
                    <Zap className="w-5 h-5 mr-1" /> Pay Now
                  </Button>
                  <Button
                    onClick={() => openQR("₹2,62,000", "Pay Full Amount")}
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full h-14 text-base font-semibold bg-white/5 border-white/20 text-white hover:bg-white/15 hover:text-white"
                  >
                    <Wallet className="w-5 h-5 mr-1" /> Pay Full Amount
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

      <PayQRDialog open={qrOpen} onOpenChange={setQrOpen} amount={qrAmount} title={qrTitle} />
    </section>
  );
};

export default Payment;
