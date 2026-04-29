import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { emptyTrip, slugify, type ItineraryDay, type HotelEntry, type PaymentInst } from "@/lib/tripTypes";

const AdminTripForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAdminAuth();

  const [form, setForm] = useState<any>(emptyTrip());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Error", description: error?.message || "Not found", variant: "destructive" });
          navigate("/admin");
          return;
        }
        setForm(data);
        setLoading(false);
      });
  }, [id, isEdit, navigate, toast]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const setListItem = (key: string, idx: number, value: any) => {
    setForm((f: any) => {
      const list = [...(f[key] || [])];
      list[idx] = value;
      return { ...f, [key]: list };
    });
  };

  const addListItem = (key: string, item: any) =>
    setForm((f: any) => ({ ...f, [key]: [...(f[key] || []), item] }));

  const removeListItem = (key: string, idx: number) =>
    setForm((f: any) => ({
      ...f,
      [key]: (f[key] || []).filter((_: any, i: number) => i !== idx),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.client_name);
      const payload: any = { ...form, slug };
      if (!isEdit) {
        const { data: { user } } = await supabase.auth.getUser();
        payload.created_by = user?.id;
      }
      // Strip db-managed fields
      delete payload.created_at;
      delete payload.updated_at;
      if (!isEdit) delete payload.id;

      const query = isEdit
        ? supabase.from("trips").update(payload).eq("id", id!)
        : supabase.from("trips").insert(payload);
      const { error } = await query;
      if (error) throw error;
      toast({
        title: isEdit ? "Trip updated" : "Trip created",
        description: `Page available at /trip/${slug}`,
      });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-gradient-soft pb-20">
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container-custom flex items-center justify-between py-4 px-4 md:px-8">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-11 px-6"
          >
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Trip"}
          </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="container-custom px-4 md:px-8 py-10 space-y-8 max-w-5xl">
        <div>
          <h1 className="heading-lg">{isEdit ? "Edit Trip" : "Create New Trip"}</h1>
          <p className="text-muted-foreground mt-2">Fill in details. Page generates automatically.</p>
        </div>

        {/* Basics */}
        <Section title="Client & Trip Basics">
          <Grid>
            <Field label="Client Name *">
              <Input required value={form.client_name} onChange={(e) => set("client_name", e.target.value)} />
            </Field>
            <Field label="Unique Client ID (slug) — auto if blank">
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase())}
                placeholder="e.g. amitsutar1234"
              />
            </Field>
            <Field label="Destination *">
              <Input required value={form.destination} onChange={(e) => set("destination", e.target.value)} />
            </Field>
            <Field label="Number of Days">
              <Input
                type="number"
                value={form.num_days ?? ""}
                onChange={(e) => set("num_days", e.target.value ? parseInt(e.target.value) : null)}
              />
            </Field>
            <Field label="Start Date">
              <Input
                type="date"
                value={form.start_date ?? ""}
                onChange={(e) => set("start_date", e.target.value || null)}
              />
            </Field>
            <Field label="End Date">
              <Input
                type="date"
                value={form.end_date ?? ""}
                onChange={(e) => set("end_date", e.target.value || null)}
              />
            </Field>
            <Field label="Budget (₹)">
              <Input
                type="number"
                value={form.budget ?? ""}
                onChange={(e) => set("budget", e.target.value ? parseFloat(e.target.value) : null)}
              />
            </Field>
            <Field label="Total Package Cost (₹)">
              <Input
                type="number"
                value={form.total_cost ?? ""}
                onChange={(e) => set("total_cost", e.target.value ? parseFloat(e.target.value) : null)}
              />
            </Field>
          </Grid>
          <Field label="Hero Image URL (optional)">
            <Input
              value={form.hero_image ?? ""}
              onChange={(e) => set("hero_image", e.target.value || null)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Overview / Description">
            <Textarea
              rows={3}
              value={form.overview ?? ""}
              onChange={(e) => set("overview", e.target.value || null)}
            />
          </Field>
        </Section>

        {/* Transport */}
        <Section title="Transport Details">
          <Field label="Transport summary (e.g. Train + 17 Seater Tempo)">
            <Textarea
              rows={2}
              value={form.transport?.details ?? ""}
              onChange={(e) => set("transport", { ...form.transport, details: e.target.value })}
            />
          </Field>
        </Section>

        {/* Day-wise Itinerary */}
        <Section
          title="Day-wise Itinerary"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                addListItem("itinerary", {
                  day: (form.itinerary?.length || 0) + 1,
                  date: "",
                  title: "",
                  description: "",
                })
              }
            >
              <Plus className="w-4 h-4 mr-1" /> Add Day
            </Button>
          }
        >
          {(form.itinerary as ItineraryDay[]).map((d, i) => (
            <div key={i} className="rounded-2xl border border-border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-secondary">Day {d.day}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeListItem("itinerary", i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Grid>
                <Input
                  placeholder="Day #"
                  type="number"
                  value={d.day}
                  onChange={(e) => setListItem("itinerary", i, { ...d, day: parseInt(e.target.value) || 0 })}
                />
                <Input
                  placeholder="Date (e.g. 22 May 2026)"
                  value={d.date}
                  onChange={(e) => setListItem("itinerary", i, { ...d, date: e.target.value })}
                />
              </Grid>
              <Input
                placeholder="Title"
                value={d.title}
                onChange={(e) => setListItem("itinerary", i, { ...d, title: e.target.value })}
              />
              <Textarea
                rows={2}
                placeholder="Description"
                value={d.description}
                onChange={(e) => setListItem("itinerary", i, { ...d, description: e.target.value })}
              />
              <Grid cols={3}>
                <Input
                  placeholder="Hotel (optional)"
                  value={d.hotel ?? ""}
                  onChange={(e) => setListItem("itinerary", i, { ...d, hotel: e.target.value })}
                />
                <Input
                  placeholder="Meals (optional)"
                  value={d.meals ?? ""}
                  onChange={(e) => setListItem("itinerary", i, { ...d, meals: e.target.value })}
                />
                <Input
                  placeholder="Transport (optional)"
                  value={d.transport ?? ""}
                  onChange={(e) => setListItem("itinerary", i, { ...d, transport: e.target.value })}
                />
              </Grid>
            </div>
          ))}
        </Section>

        {/* Hotels */}
        <Section
          title="Hotels"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => addListItem("hotels", { city: "", name: "", note: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Hotel
            </Button>
          }
        >
          {(form.hotels as HotelEntry[]).map((h, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_2fr_2fr_auto] gap-2 items-start">
              <Input
                placeholder="City"
                value={h.city}
                onChange={(e) => setListItem("hotels", i, { ...h, city: e.target.value })}
              />
              <Input
                placeholder="Hotel name"
                value={h.name}
                onChange={(e) => setListItem("hotels", i, { ...h, name: e.target.value })}
              />
              <Input
                placeholder="Note (e.g. Breakfast & Dinner)"
                value={h.note ?? ""}
                onChange={(e) => setListItem("hotels", i, { ...h, note: e.target.value })}
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("hotels", i)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Section>

        {/* Activities */}
        <Section
          title="Activities"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => addListItem("activities", "")}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          }
        >
          {(form.activities as string[]).map((a, i) => (
            <div key={i} className="flex gap-2">
              <Input value={a} onChange={(e) => setListItem("activities", i, e.target.value)} />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("activities", i)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Section>

        {/* Inclusions / Exclusions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section
            title="Inclusions"
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => addListItem("inclusions", "")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            }
          >
            {(form.inclusions as string[]).map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input value={s} onChange={(e) => setListItem("inclusions", i, e.target.value)} />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("inclusions", i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </Section>
          <Section
            title="Exclusions"
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => addListItem("exclusions", "")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            }
          >
            {(form.exclusions as string[]).map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input value={s} onChange={(e) => setListItem("exclusions", i, e.target.value)} />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("exclusions", i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </Section>
        </div>

        {/* Payments */}
        <Section
          title="Payment Schedule"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => addListItem("payments", { label: "", amount: "", meta: "", via: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Installment
            </Button>
          }
        >
          {(form.payments as PaymentInst[]).map((p, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_1fr_2fr_2fr_auto] gap-2">
              <Input
                placeholder="Label (e.g. 1st)"
                value={p.label}
                onChange={(e) => setListItem("payments", i, { ...p, label: e.target.value })}
              />
              <Input
                placeholder="Amount (₹90,000)"
                value={p.amount}
                onChange={(e) => setListItem("payments", i, { ...p, amount: e.target.value })}
              />
              <Input
                placeholder="Date / meta"
                value={p.meta ?? ""}
                onChange={(e) => setListItem("payments", i, { ...p, meta: e.target.value })}
              />
              <Input
                placeholder="Via / note"
                value={p.via ?? ""}
                onChange={(e) => setListItem("payments", i, { ...p, via: e.target.value })}
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("payments", i)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Section>

        {/* Notes */}
        <Section title="Notes / Special Instructions">
          <Textarea
            rows={4}
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value || null)}
          />
        </Section>

        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-14 text-base font-semibold"
        >
          <Save className="w-5 h-5 mr-1" /> {saving ? "Saving..." : isEdit ? "Update Trip" : "Create Trip Page"}
        </Button>
      </form>
    </main>
  );
};

const Section = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="card-elegant p-6 md:p-8">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      {action}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-sm font-semibold text-primary">{label}</Label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const Grid = ({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>{children}</div>
);

export default AdminTripForm;
