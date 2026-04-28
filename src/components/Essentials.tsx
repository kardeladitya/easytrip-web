import { Backpack, FileText, Shirt, Plug, Pill } from "lucide-react";

const groups = [
  {
    title: "Documents",
    icon: <FileText className="w-5 h-5" />,
    items: ["Government ID Proof", "Train Tickets", "ATM Cards / Cash"],
  },
  {
    title: "Clothing",
    icon: <Shirt className="w-5 h-5" />,
    items: ["Heavy Jackets", "Thermal Wear", "Woolen Caps & Gloves", "Warm Socks", "Comfortable Shoes"],
  },
  {
    title: "Electronics",
    icon: <Plug className="w-5 h-5" />,
    items: ["Power Bank (very important)", "Chargers", "Extra Batteries (drains faster at altitude)"],
  },
  {
    title: "Medical",
    icon: <Pill className="w-5 h-5" />,
    items: [
      "Personal medicines",
      "Paracetamol",
      "Diamox (after doctor consultation)",
      "Prawasi tablet (motion sickness)",
      "ORS packets",
      "Cold & cough medicines",
      "Band-aid, antiseptic cream",
    ],
  },
];

const Essentials = () => {
  return (
    <section id="essentials" className="section-padding bg-gradient-soft">
      <div className="container-custom">
        <div className="section-label">
          <Backpack className="w-4 h-4" /> Trip Essentials
        </div>
        <h2 className="heading-lg mt-4">Must-Carry Checklist</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          Pack smart. Travel light. Stay prepared for the high Himalayas.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {groups.map((g) => (
            <div key={g.title} className="card-elegant p-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary text-secondary-foreground flex items-center justify-center">
                  {g.icon}
                </div>
                <h3 className="text-lg font-bold text-primary">{g.title}</h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1 w-4 h-4 rounded border-2 border-secondary flex items-center justify-center shrink-0">
                      <span className="block w-1.5 h-1.5 rounded-sm bg-secondary" />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Essentials;
