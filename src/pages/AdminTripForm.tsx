import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Upload } from "lucide-react";
import {
  emptyTrip,
  slugify,
  type ItineraryDay,
  type HotelEntry,
  type PaymentInst,
  type TransportItem,
  type ChecklistGroup,
  type GuidelineItem,
} from "@/lib/tripTypes";

const AdminTripForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAdminAuth();

  const [form, setForm] = useState<any>(emptyTrip());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
        // Backfill any new optional fields so inputs are controlled
        setForm({ ...emptyTrip(), ...data });
        setLoading(false);
      });
  }, [id, isEdit, navigate, toast]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const setNested = (k: string, sub: string, v: any) =>
    setForm((f: any) => ({ ...f, [k]: { ...(f[k] || {}), [sub]: v } }));

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

  const handleQrUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `qr/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("trip-assets").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("trip-assets").getPublicUrl(path);
      set("payment_qr_url", data.publicUrl);
      toast({ title: "QR uploaded", description: "Payment QR image updated." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

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
            <Field label="Number of Nights">
              <Input
                type="number"
                value={form.num_nights ?? ""}
                onChange={(e) => set("num_nights", e.target.value ? parseInt(e.target.value) : null)}
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
          <Field label="Overview / Short Description (hero subtitle)">
            <Textarea
              rows={3}
              value={form.overview ?? ""}
              onChange={(e) => set("overview", e.target.value || null)}
            />
          </Field>
        </Section>

        {/* About */}
        <Section title="About Section">
          <Field label="Heading">
            <Input
              value={form.about?.heading ?? ""}
              onChange={(e) => setNested("about", "heading", e.target.value)}
              placeholder="e.g. Trusted by Thousands of Indian Travellers"
            />
          </Field>
          <Field label="Description (rich text — supports line breaks)">
            <Textarea
              rows={6}
              value={form.about?.body ?? ""}
              onChange={(e) => setNested("about", "body", e.target.value)}
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

        {/* Transport Info (structured) */}
        <Section
          title="Transport Info (Train / Cruise / Cab / Bus / Flight)"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                addListItem("transport_items", { type: "Train", name: "", timing: "", details: "", notes: "" })
              }
            >
              <Plus className="w-4 h-4 mr-1" /> Add Transport
            </Button>
          }
        >
          <Field label="Optional one-line transport summary">
            <Input
              value={form.transport?.details ?? ""}
              onChange={(e) => set("transport", { ...form.transport, details: e.target.value })}
              placeholder="e.g. Train + 17 Seater Tempo"
            />
          </Field>
          {(form.transport_items as TransportItem[]).map((t, i) => (
            <div key={i} className="rounded-2xl border border-border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-secondary">{t.type || "Transport"} #{i + 1}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => removeListItem("transport_items", i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Grid>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={t.type}
                  onChange={(e) => setListItem("transport_items", i, { ...t, type: e.target.value })}
                >
                  {["Train", "Cruise", "Cab", "Bus", "Flight"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <Input
                  placeholder="Name / Number (e.g. 12101 Mumbai Mail)"
                  value={t.name ?? ""}
                  onChange={(e) => setListItem("transport_items", i, { ...t, name: e.target.value })}
                />
              </Grid>
              <Grid>
                <Input
                  placeholder="Timing (e.g. Dep 22:30 · Arr 06:15)"
                  value={t.timing ?? ""}
                  onChange={(e) => setListItem("transport_items", i, { ...t, timing: e.target.value })}
                />
                <Input
                  placeholder="Route / Details"
                  value={t.details ?? ""}
                  onChange={(e) => setListItem("transport_items", i, { ...t, details: e.target.value })}
                />
              </Grid>
              <Textarea
                rows={2}
                placeholder="Notes"
                value={t.notes ?? ""}
                onChange={(e) => setListItem("transport_items", i, { ...t, notes: e.target.value })}
              />
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

        {/* Must Carry Checklist */}
        <Section
          title="Must-Carry Checklist"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => addListItem("checklist", { title: "", items: [""] })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Group
            </Button>
          }
        >
          {(form.checklist as ChecklistGroup[]).map((g, gi) => (
            <div key={gi} className="rounded-2xl border border-border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between gap-2">
                <Input
                  placeholder="Group title (e.g. Documents, Clothing)"
                  value={g.title}
                  onChange={(e) => setListItem("checklist", gi, { ...g, title: e.target.value })}
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("checklist", gi)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                {(g.items || []).map((it, ii) => (
                  <div key={ii} className="flex gap-2">
                    <Input
                      placeholder="Item"
                      value={it}
                      onChange={(e) => {
                        const items = [...g.items];
                        items[ii] = e.target.value;
                        setListItem("checklist", gi, { ...g, items });
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const items = g.items.filter((_, x) => x !== ii);
                        setListItem("checklist", gi, { ...g, items });
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setListItem("checklist", gi, { ...g, items: [...(g.items || []), ""] })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
            </div>
          ))}
        </Section>

        {/* Important Guidelines */}
        <Section
          title="Important Guidelines"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => addListItem("guidelines", { text: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Guideline
            </Button>
          }
        >
          {(form.guidelines as GuidelineItem[]).map((g, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                rows={2}
                placeholder="Guideline point"
                value={g.text}
                onChange={(e) => setListItem("guidelines", i, { ...g, text: e.target.value })}
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeListItem("guidelines", i)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Section>

        {/* Climate */}
        <Section title="Climate Information">
          <Grid>
            <Field label="Daytime Temperature">
              <Input
                value={form.climate?.day_temp ?? ""}
                onChange={(e) => setNested("climate", "day_temp", e.target.value)}
                placeholder="e.g. 10°C – 20°C"
              />
            </Field>
            <Field label="Nighttime Temperature">
              <Input
                value={form.climate?.night_temp ?? ""}
                onChange={(e) => setNested("climate", "night_temp", e.target.value)}
                placeholder="e.g. 0°C – 8°C"
              />
            </Field>
          </Grid>
          <Field label="Weather Details">
            <Textarea
              rows={2}
              value={form.climate?.weather ?? ""}
              onChange={(e) => setNested("climate", "weather", e.target.value)}
            />
          </Field>
          <Field label="Clothing Suggestions">
            <Textarea
              rows={2}
              value={form.climate?.clothing ?? ""}
              onChange={(e) => setNested("climate", "clothing", e.target.value)}
            />
          </Field>
          <Field label="Seasonal Notes">
            <Textarea
              rows={2}
              value={form.climate?.notes ?? ""}
              onChange={(e) => setNested("climate", "notes", e.target.value)}
            />
          </Field>
        </Section>

        {/* Tipping */}
        <Section title="Tipping Information">
          <Grid>
            <Field label="Currency">
              <Input
                value={form.tipping?.currency ?? ""}
                onChange={(e) => setNested("tipping", "currency", e.target.value)}
                placeholder="e.g. INR"
              />
            </Field>
            <Field label="Suggested Amount">
              <Input
                value={form.tipping?.amount ?? ""}
                onChange={(e) => setNested("tipping", "amount", e.target.value)}
                placeholder="e.g. ₹200–500 per day"
              />
            </Field>
          </Grid>
          <Field label="Notes">
            <Textarea
              rows={3}
              value={form.tipping?.notes ?? ""}
              onChange={(e) => setNested("tipping", "notes", e.target.value)}
            />
          </Field>
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

        {/* Payment QR */}
        <Section title="Payment QR Image">
          <p className="text-sm text-muted-foreground -mt-2">
            Default QR is used if none uploaded. Upload a new image to override for this trip.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-32 h-32 rounded-xl border border-border bg-background overflow-hidden flex items-center justify-center">
              {form.payment_qr_url ? (
                <img src={form.payment_qr_url} alt="QR" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground text-center px-2">Default QR</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-semibold text-primary">
                <span className="inline-flex items-center gap-2 cursor-pointer rounded-full border border-input px-4 py-2 hover:bg-accent">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload new QR"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleQrUpload(f);
                    }}
                  />
                </span>
              </Label>
              {form.payment_qr_url && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => set("payment_qr_url", null)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Reset to default
                </Button>
              )}
            </div>
          </div>
        </Section>

        {/* Terms */}
        <Section title="Terms & Important Notes">
          <Textarea
            rows={6}
            value={form.terms ?? ""}
            onChange={(e) => set("terms", e.target.value || null)}
            placeholder="Full terms — supports line breaks. Displayed at the bottom of the trip page."
          />
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

const Grid = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
  <div className={`grid gap-3 ${cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>{children}</div>
);

export default AdminTripForm;
