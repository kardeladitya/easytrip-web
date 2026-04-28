import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TrainDetails from "@/components/TrainDetails";
import Itinerary from "@/components/Itinerary";
import Hotels from "@/components/Hotels";
import Cost from "@/components/Cost";
import Payment from "@/components/Payment";
import Inclusions from "@/components/Inclusions";
import Essentials from "@/components/Essentials";
import Guidelines from "@/components/Guidelines";
import Temperature from "@/components/Temperature";
import Tips from "@/components/Tips";
import Terms from "@/components/Terms";
import Coins41k from "@/components/Coins41k";
import Footer from "@/components/Footer";
import StickyPay from "@/components/StickyPay";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <TrainDetails />
      <Itinerary />
      <Hotels />
      <Cost />
      <Payment />
      <Inclusions />
      <Essentials />
      <Guidelines />
      <Temperature />
      <Tips />
      <Terms />
      <Coins41k />
      <Footer />
      <StickyPay />
    </main>
  );
};

export default Index;
