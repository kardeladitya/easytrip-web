import { useState } from "react";
import { Zap } from "lucide-react";
import PayQRDialog from "./PayQRDialog";

const StickyPay = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border shadow-elegant px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Pending</div>
          <div className="text-lg font-extrabold text-primary leading-tight">₹2,62,000</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-primary text-secondary-foreground rounded-full px-5 h-12 font-semibold text-sm shadow-elegant"
        >
          <Zap className="w-4 h-4" /> Pay Now
        </button>
      </div>
      <PayQRDialog open={open} onOpenChange={setOpen} amount="₹2,62,000" title="Pay Pending Amount" />
    </>
  );
};

export default StickyPay;
