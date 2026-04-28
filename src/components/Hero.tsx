import heroImg from "@/assets/hero-ladakh.jpg";
import { Button } from "@/components/ui/button";
import { Calendar, User, Hash, Users, Zap, BookOpen, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end overflow-hidden"
    >
      {/* Background image */}
      <img
        src={heroImg}
        alt="Ladakh Himalayan mountain landscape at golden hour"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-primary/30" />

      <div className="relative container-custom w-full px-4 md:px-8 pb-16 md:pb-24 pt-32">
        <div className="max-w-4xl fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 border border-success/40 backdrop-blur-md mb-8">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-success">
              EasyTrip India · Government Registered
            </span>
          </div>

          <h1 className="text-white font-extrabold leading-[1.05] tracking-tight">
            <span className="block text-4xl md:text-6xl lg:text-7xl">Ladakh Group Tour</span>
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 bg-gradient-gold bg-clip-text text-transparent">
              10 Nights / 11 Days
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">
            A curated Himalayan journey through the land of high passes — designed and hosted by EasyTrip India.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <InfoChip icon={<User className="w-4 h-4" />} text="Mr. Amit Sutar" />
            <InfoChip icon={<Hash className="w-4 h-4" />} text="ETI-LADAKH-226041" />
            <InfoChip icon={<Calendar className="w-4 h-4" />} text="23 May – 02 June 2026" />
            <InfoChip icon={<Users className="w-4 h-4" />} text="Hosted by Shlok Bagore" />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-primary text-secondary-foreground hover:opacity-95 shadow-elegant rounded-full px-8 h-14 text-base font-semibold pulse-glow"
            >
              <a href="#payment">
                <Zap className="w-5 h-5 mr-1" />
                Pay Now
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-base font-semibold bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white backdrop-blur-md"
            >
              <a href="#itinerary">
                <BookOpen className="w-5 h-5 mr-1" />
                View Itinerary
              </a>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl md:ml-auto md:max-w-md">
          <Stat value="11" label="Days" />
          <Stat value="5" label="Destinations" />
          <Stat value="12" label="Tickets" />
        </div>
      </div>
    </section>
  );
};

const InfoChip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium">
    <span className="text-warning">{icon}</span>
    {text}
  </span>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md p-4 md:p-6 text-center">
    <div className="text-3xl md:text-4xl font-extrabold text-warning">{value}</div>
    <div className="text-xs uppercase tracking-widest text-white/70 mt-1">{label}</div>
  </div>
);

export default Hero;
