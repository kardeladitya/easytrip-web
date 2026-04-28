import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#itinerary", label: "Itinerary" },
  { href: "#hotels", label: "Hotels" },
  { href: "#cost", label: "Cost" },
  { href: "#payment", label: "Payment" },
  { href: "#essentials", label: "Essentials" },
  { href: "#terms", label: "Terms" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom flex items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="EasyTrip India"
            className={`transition-all duration-300 object-contain ${
              scrolled ? "h-12 md:h-14" : "h-16 md:h-20"
            }`}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                scrolled ? "text-primary" : "text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Button
          asChild
          className="bg-gradient-primary text-secondary-foreground hover:opacity-90 shadow-elegant rounded-full px-6"
        >
          <a href="#payment">Pay Now</a>
        </Button>
      </div>
    </header>
  );
};

export default Header;
