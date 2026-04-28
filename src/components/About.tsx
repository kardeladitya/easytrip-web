import { Building2, Globe, Mail, Headphones, ShieldCheck, Award } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="section-padding bg-gradient-soft">
      <div className="container-custom grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <div className="section-label">
            <Building2 className="w-4 h-4" /> About Us
          </div>
          <h2 className="heading-lg mt-4">
            Trusted by Thousands of <span className="text-secondary">Indian Travellers</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            EasyTrip India is a Government of India registered tour company, proudly recognized
            by Maharashtra Tourism. We specialize in well-managed group tours, customized
            experiences, and round-the-clock on-ground support to ensure every journey is smooth,
            safe, and deeply memorable.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
            From the high passes of Ladakh to the beaches of Goa, our team of passionate travel
            experts craft every trip with care. Your adventure is our responsibility.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Badge icon={<Award className="w-4 h-4" />} text="Govt. of India Registered" />
            <Badge icon={<ShieldCheck className="w-4 h-4" />} text="Maharashtra Tourism Recognized" />
            <Badge icon={<Headphones className="w-4 h-4" />} text="24×7 On-Ground Support" />
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-dark p-8 md:p-10 shadow-elegant relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
          <h3 className="text-2xl font-bold text-white relative">Get in Touch</h3>

          <div className="mt-8 space-y-5 relative">
            <ContactRow icon={<Globe className="w-5 h-5" />} label="www.Easytripindia.tours" href="https://www.easytripindia.tours" />
            <ContactRow icon={<Mail className="w-5 h-5" />} label="reservations@easytripindia.tours" href="mailto:reservations@easytripindia.tours" />
            <ContactRow icon={<Headphones className="w-5 h-5" />} label="24×7 Customer Support" />
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
              SB
            </div>
            <div>
              <div className="text-white font-semibold">Shlok Bagore</div>
              <div className="text-white/60 text-sm">Your Trip Host · EasyTrip India</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Badge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
    {icon}
    {text}
  </span>
);

const ContactRow = ({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) => {
  const content = (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
        {icon}
      </div>
      <span className="text-white text-base md:text-lg font-medium">{label}</span>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
};

export default About;
