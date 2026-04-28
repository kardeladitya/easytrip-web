import { Tag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Cost = () => {
  return (
    <section id="cost" className="relative section-padding bg-gradient-dark text-white overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-warning/10 blur-3xl" />

      <div className="container-custom relative text-center">
        <div className="inline-flex items-center gap-2 text-warning text-sm font-bold uppercase tracking-widest">
          <span className="w-8 h-[2px] bg-warning" />
          <Tag className="w-4 h-4" /> Package Cost
        </div>

        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Total Package Value</h2>

        <div className="mt-8 relative inline-block">
          <div className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-gold bg-clip-text text-transparent leading-none drop-shadow-[0_0_60px_hsl(42_88%_55%_/_0.4)]">
            ₹4,10,000
          </div>
        </div>

        <p className="mt-4 text-white/70">Inclusive of 5% GST · All taxes included</p>

        <div className="mt-12 max-w-md mx-auto">
          <Stat value="5%" label="GST Included" tone="muted" />
        </div>

        <Button
          asChild
          size="lg"
          className="mt-10 bg-gradient-primary text-secondary-foreground hover:opacity-95 shadow-elegant rounded-full px-10 h-14 text-base font-semibold"
        >
          <a href="#payment">
            <Zap className="w-5 h-5 mr-1" />
            View Payment Breakdown
          </a>
        </Button>
      </div>
    </section>
  );
};

const Stat = ({ value, label, tone }: { value: string; label: string; tone: "success" | "warn" | "muted" }) => {
  const colors = {
    success: "text-success border-success/30",
    warn: "text-warning border-warning/30",
    muted: "text-white/80 border-white/15",
  };
  return (
    <div className={`rounded-2xl bg-white/5 border backdrop-blur-md p-6 ${colors[tone]}`}>
      <div className={`text-2xl md:text-3xl font-extrabold ${colors[tone].split(" ")[0]}`}>{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </div>
  );
};

export default Cost;
