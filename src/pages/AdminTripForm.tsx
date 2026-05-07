import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createTrip, getTrip, updateTrip } from "@/lib/tripsApi";
import { emptyTrip, slugify, type Trip, type ItineraryDay, type HotelEntry, type PaymentInst } from "@/lib/tripTypes";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="p-5 md:p-6 border-0 shadow-sm">
    <h3 className="text-base font-bold text-slate-900 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </Card>
);

const AdminTripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Omit<Trip, "id" | "created_at" | "updated_at">>(() => emptyTrip());

  useEffect(() => {
    if (!id) return;
    getTrip(id)
      .then((t) => {
        if (t) {
          const { id: _i, created_at: _c, updated_at: _u, ...rest } = t;
          setData(rest as any);
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData((p) => ({ ...p, [k]: v }));

  // Inclusions / Exclusions / Activities (string arrays)
  const updateStringArr = (key: "inclusions" | "exclusions" | "activities", idx: number, val: string) => {
    const arr = [...(data[key] as string[])];
    arr[idx] = val;
    set(key, arr as any);
  };
  const addString = (key: "inclusions" | "exclusions" | "activities") =>
    set(key, [...(data[key] as string[]), ""] as any);
  const removeString = (key: "inclusions" | "exclusions" | "activities", idx: number) =>
    set(key, (data[key] as string[]).filter((_, i) => i !== idx) as any);

  // Hotels
  const addHotel = () => set("hotels", [...data.hotels, { city: "", name: "", note: "" }]);
  const updHotel = (i: number, k: keyof HotelEntry, v: string) => {
    const a = [...data.hotels]; a[i] = { ...a[i], [k]: v }; set("hotels", a);
  };
  const rmHotel = (i: number) => set("hotels", data.hotels.filter((_, x) => x !== i));

  // Itinerary
  const addDay = () =>
    set("itinerary", [
      ...data.itinerary,
      { day: data.itinerary.length + 1, date: "", title: "", description: "", hotel: "", meals: "", transport: "" },
    ]);
  const updDay = (i: number, k: keyof ItineraryDay, v: string | number) => {
    const a = [...data.itinerary]; a[i] = { ...a[i], [k]: v as any }; set("itinerary", a);
  };
  const rmDay = (i: number) => set("itinerary", data.itinerary.filter((_, x) => x !== i).map((d, x) => ({ ...d, day: x + 1 })));

  // Payments
  const addPay = () => set("payments", [...data.payments, { label: "", amount: "", meta: "", via: "" }]);
  const updPay = (i: number, k: keyof PaymentInst, v: string) => {
    const a = [...data.payments]; a[i] = { ...a[i], [k]: v }; set("payments", a);
  };
  const rmPay = (i: number) => set("payments", data.payments.filter((_, x) => x !== i));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data.client_name.trim() || !data.destination.trim()) {
      toast.error("Client name and destination are required");
      return;
    }
    const payload = {
      ...data,
      slug: data.slug.trim() || slugify(data.client_name),
      inclusions: (data.inclusions || []).filter((x) => x.trim()),
      exclusions: (data.exclusions || []).filter((x) => x.trim()),
      activities: (data.activities || []).filter((x) => x.trim()),
    };
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateTrip(id, payload);
        toast.success("Trip updated");
      } else {
        const t = await createTrip(payload);
        toast.success(`Trip created at /trip/${t.slug}`);
      }
      navigate("/admin-7823-secure-panel/trips");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout title="Loading..."><div className="text-slate-400">Loading trip...</div></AdminLayout>;

  return (
    <AdminLayout title={isEdit ? "Edit Trip" : "Create Trip"}>
      <form onSubmit={onSubmit} className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <Button asChild type="button" variant="ghost" size="sm">
            <Link to="/admin-7823-secure-panel/trips"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
          </Button>
          <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : isEdit ? "Update Trip" : "Create Trip"}
          </Button>
        </div>

        <Section title="Client & Destination">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Client Name *">
              <Input value={data.client_name} onChange={(e) => set("client_name", e.target.value)} required />
            </Field>
            <Field label="Unique Client ID / Slug">
              <Input value={data.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, ""))} placeholder="auto-generated" />
            </Field>
            <Field label="Destination *">
              <Input value={data.destination} onChange={(e) => set("destination", e.target.value)} required />
            </Field>
            <Field label="Hero Image URL">
              <Input value={data.hero_image || ""} onChange={(e) => set("hero_image", e.target.value)} />
            </Field>
            <Field label="Start Date">
              <Input type="date" value={data.start_date || ""} onChange={(e) => set("start_date", e.target.value || null)} />
            </Field>
            <Field label="End Date">
              <Input type="date" value={data.end_date || ""} onChange={(e) => set("end_date", e.target.value || null)} />
            </Field>
            <Field label="Number of Days">
              <Input type="number" value={data.num_days ?? ""} onChange={(e) => set("num_days", e.target.value ? Number(e.target.value) : null)} />
            </Field>
            <Field label="Total Cost (₹)">
              <Input type="number" value={data.total_cost ?? ""} onChange={(e) => set("total_cost", e.target.value ? Number(e.target.value) : null)} />
            </Field>
          </div>
          <Field label="Overview">
            <Textarea rows={3} value={data.overview || ""} onChange={(e) => set("overview", e.target.value)} />
          </Field>
        </Section>

        <Section title="Hotels">
          {data.hotels.map((h, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-end p-3 rounded-lg bg-slate-50">
              <Input placeholder="City" value={h.city} onChange={(e) => updHotel(i, "city", e.target.value)} />
              <Input placeholder="Hotel name" value={h.name} onChange={(e) => updHotel(i, "name", e.target.value)} />
              <Input placeholder="Note" value={h.note || ""} onChange={(e) => updHotel(i, "note", e.target.value)} />
              <Button type="button" size="icon" variant="ghost" onClick={() => rmHotel(i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          ))}
          <AddBtn onClick={addHotel}>Add Hotel</AddBtn>
        </Section>

        <Section title="Transport">
          <Textarea
            rows={3}
            placeholder="Train / flight / bus details"
            value={data.transport?.details || ""}
            onChange={(e) => set("transport", { details: e.target.value })}
          />
        </Section>

        <Section title="Day-wise Itinerary">
          {data.itinerary.map((d, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700">Day {d.day}</span>
                <Button type="button" size="icon" variant="ghost" onClick={() => rmDay(i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <Input placeholder="Date" value={d.date} onChange={(e) => updDay(i, "date", e.target.value)} />
                <Input placeholder="Title" value={d.title} onChange={(e) => updDay(i, "title", e.target.value)} />
              </div>
              <Textarea rows={2} placeholder="Description" value={d.description} onChange={(e) => updDay(i, "description", e.target.value)} />
              <div className="grid md:grid-cols-3 gap-2">
                <Input placeholder="Hotel" value={d.hotel || ""} onChange={(e) => updDay(i, "hotel", e.target.value)} />
                <Input placeholder="Meals" value={d.meals || ""} onChange={(e) => updDay(i, "meals", e.target.value)} />
                <Input placeholder="Transport" value={d.transport || ""} onChange={(e) => updDay(i, "transport", e.target.value)} />
              </div>
            </div>
          ))}
          <AddBtn onClick={addDay}>Add Day</AddBtn>
        </Section>

        <div className="grid md:grid-cols-2 gap-5">
          <StringArrSection title="Inclusions" items={data.inclusions} onAdd={() => addString("inclusions")} onUpd={(i, v) => updateStringArr("inclusions", i, v)} onRm={(i) => removeString("inclusions", i)} />
          <StringArrSection title="Exclusions" items={data.exclusions} onAdd={() => addString("exclusions")} onUpd={(i, v) => updateStringArr("exclusions", i, v)} onRm={(i) => removeString("exclusions", i)} />
        </div>

        <StringArrSection title="Activities" items={data.activities} onAdd={() => addString("activities")} onUpd={(i, v) => updateStringArr("activities", i, v)} onRm={(i) => removeString("activities", i)} />

        <Section title="Payment Installments">
          {data.payments.map((p, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end p-3 rounded-lg bg-slate-50">
              <Input placeholder="Label (1st, 2nd...)" value={p.label} onChange={(e) => updPay(i, "label", e.target.value)} />
              <Input placeholder="Amount" value={p.amount} onChange={(e) => updPay(i, "amount", e.target.value)} />
              <Input placeholder="Meta (due date...)" value={p.meta || ""} onChange={(e) => updPay(i, "meta", e.target.value)} />
              <Input placeholder="Via (UPI/Bank)" value={p.via || ""} onChange={(e) => updPay(i, "via", e.target.value)} />
              <Button type="button" size="icon" variant="ghost" onClick={() => rmPay(i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          ))}
          <AddBtn onClick={addPay}>Add Installment</AddBtn>
        </Section>

        <Section title="Notes / Special Instructions">
          <Textarea rows={4} value={data.notes || ""} onChange={(e) => set("notes", e.target.value)} />
        </Section>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : isEdit ? "Update Trip" : "Create Trip"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-600">{label}</Label>
    {children}
  </div>
);

const AddBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <Button type="button" variant="outline" size="sm" onClick={onClick} className="border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50">
    <Plus className="w-4 h-4 mr-1" /> {children}
  </Button>
);

const StringArrSection = ({
  title, items, onAdd, onUpd, onRm,
}: { title: string; items: string[]; onAdd: () => void; onUpd: (i: number, v: string) => void; onRm: (i: number) => void }) => (
  <Section title={title}>
    {items.map((v, i) => (
      <div key={i} className="flex gap-2">
        <Input value={v} onChange={(e) => onUpd(i, e.target.value)} />
        <Button type="button" size="icon" variant="ghost" onClick={() => onRm(i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
      </div>
    ))}
    <AddBtn onClick={onAdd}>Add {title.slice(0, -1)}</AddBtn>
  </Section>
);

export default AdminTripForm;
