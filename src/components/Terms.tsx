import { FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    id: "terms",
    title: "Terms & Conditions",
    items: [
      "Minimum 12 adults required to confirm the package.",
      "Refunds will be applicable as per the standard cancellation policy.",
      "Package rates are valid only for the selected travel dates, room category, and services mentioned.",
      "Guests are requested to follow hotel/resort policies during their stay.",
      "Kindly be punctual for all transfers and tours for smooth operations.",
      "Valid government ID proof is mandatory for all travelers.",
      "In case of any vehicle issue, an alternate arrangement will be provided at the earliest.",
      "Standard hotel check-in/check-out timings apply as per property rules.",
      "Prices are subject to availability and may vary accordingly.",
      "For any changes during the tour, please connect with our team; assistance will be provided based on availability.",
      "Travel plans may be influenced by weather conditions, road conditions, or operational factors for safety and comfort.",
      "Any additional costs due to external factors like fuel changes, government taxes, or service revisions will be informed if applicable.",
      "Travel services (air/train/road) operate as per the respective provider's guidelines.",
      "Sightseeing and activities are planned as per time and conditions on ground.",
      "Guests are requested to carry all required travel documents at all times.",
      "At religious places, please maintain a decent dress code and decorum.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    items: [
      "30 days or more before travel: 25% of total package cost will be charged.",
      "29 to 15 days before travel: 75% of total package cost will be charged.",
      "Within 15 days of travel: 100% cancellation charges applicable.",
      "Flight cancellations will be processed as per airline policies.",
      "Cruise bookings (if any) will follow operator-specific terms.",
      "Visa fee and TCS (if applicable) are non-refundable once processed.",
      "In genuine unforeseen situations (such as medical or critical emergencies), refund requests may be considered after review and approval, subject to valid supporting documents. Processing in such cases may take up to 60 days.",
    ],
  },
  {
    id: "refund",
    title: "Refund Policy",
    items: [
      "Eligible refunds will be processed within 10 working days.",
      "Refunds will be credited to an EasyTrip India wallet for future use.",
      "Wallet balance can be used for Flights, Hotels, and Packages.",
      "Wallet balance is non-transferable, but can be used for bookings for others as well.",
    ],
  },
  {
    id: "international",
    title: "International Bookings – Terms",
    items: [
      "Cancellation and refund policies for international bookings may vary depending on airlines, hotels, visa authorities, and local suppliers.",
      "Visa fees, insurance, and processing charges are strictly non-refundable once initiated.",
      "Any changes in currency rates, government taxes, or international regulations may result in additional charges.",
      "Refund timelines for international bookings may be longer depending on supplier policies.",
      "No refund will be applicable for no-show or incomplete travel.",
      "Travel insurance is highly recommended for all international trips.",
    ],
  },
];

const Terms = () => {
  return (
    <section id="terms" className="section-padding bg-gradient-soft">
      <div className="container-custom max-w-5xl">
        <div className="section-label">
          <FileText className="w-4 h-4" /> Policies
        </div>
        <h2 className="heading-lg mt-4">Terms & Important Notes</h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Please read carefully — by making payment you agree to the following terms.
        </p>

        <Accordion type="single" collapsible className="mt-10 space-y-4">
          {sections.map((s) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className="card-elegant px-6 md:px-8 border-none"
            >
              <AccordionTrigger className="text-left text-lg md:text-xl font-bold text-primary hover:no-underline">
                {s.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2 pb-4">
                  {s.items.map((it, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Terms;
