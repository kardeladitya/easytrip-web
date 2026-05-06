import logo from "@/assets/logo.png";
import { Mail, Globe, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ADMIN_SECRET_PATH } from "@/lib/adminAuth";

const footerNav = [
  { label: "Home", href: "#top" },
  { label: "Destinations", href: "#itinerary" },
  { label: "Trips", href: "#hotels" },
  { label: "About Us", href: "#about" },
  { label: "Contact Us", href: "#footer-contact" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-white pt-16 pb-24 md:pb-12 px-4 md:px-8">
      <div className="container-custom grid md:grid-cols-3 gap-10">
        <div>
          <img src={logo} alt="EasyTrip India" className="h-20 object-contain bg-white rounded-2xl p-2 inline-block" />
          <p className="mt-5 text-white/70 leading-relaxed text-sm max-w-sm">
            EasyTrip India — A Government of India registered tour company, recognized by Maharashtra Tourism.
            Crafting memorable journeys across India and beyond.
          </p>
        </div>

        <div>
          <h4 className="text-warning font-bold uppercase text-sm tracking-widest">Contact</h4>
          <ul className="mt-5 space-y-3 text-white/80">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-secondary" />
              <a href="mailto:reservations@easytripindia.tours" className="hover:text-warning">
                reservations@easytripindia.tours
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-secondary" />
              <a href="https://www.easytripindia.tours" className="hover:text-warning">
                www.Easytripindia.tours
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-secondary" />
              <span>24×7 Customer Support</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-warning font-bold uppercase text-sm tracking-widest">Order Reference</h4>
          <ul className="mt-5 space-y-2 text-white/80 text-sm">
            <li><span className="text-white/50">Order ID:</span> ETI-LADAKH-226041</li>
            <li><span className="text-white/50">Client:</span> Mr. Amit Sutar</li>
            <li><span className="text-white/50">Host:</span> Shlok Bagore</li>
            <li><span className="text-white/50">Travel:</span> 23 May – 02 June 2026</li>
          </ul>
        </div>
      </div>

      <div className="container-custom mt-12 pt-8 border-t border-white/10">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/80">
          {footerNav.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-warning transition-colors">
              {l.label}
            </a>
          ))}
          <Link
            to={ADMIN_SECRET_PATH}
            className="hover:text-warning transition-colors font-semibold text-warning/90"
          >
            Admin Portal
          </Link>
        </nav>
        <p className="mt-6 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} EasyTrip India. All rights reserved. · Crafted with care for every traveller.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
