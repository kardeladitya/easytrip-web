import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react";
import { listTrips, deleteTrip } from "@/lib/tripsApi";
import type { Trip } from "@/lib/tripTypes";
import { toast } from "sonner";

const AdminTripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = () => {
    setLoading(true);
    listTrips()
      .then(setTrips)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return trips;
    return trips.filter(
      (t) =>
        t.client_name.toLowerCase().includes(s) ||
        t.destination.toLowerCase().includes(s) ||
        t.slug.toLowerCase().includes(s),
    );
  }, [trips, q]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await deleteTrip(id);
      toast.success("Trip deleted");
      setTrips((p) => p.filter((t) => t.id !== id));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <AdminLayout title="Manage Trips">
      <Card className="p-5 md:p-6 border-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by client, destination, slug..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-slate-50"
            />
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link to="/admin-7823-secure-panel/trips/new">
              <PlusCircle className="w-4 h-4 mr-2" /> New Trip
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Client</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No trips found.</TableCell></TableRow>
              ) : filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{t.client_name}</TableCell>
                  <TableCell>{t.destination}</TableCell>
                  <TableCell><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{t.slug}</code></TableCell>
                  <TableCell>{t.num_days || "—"}</TableCell>
                  <TableCell>₹{Number(t.total_cost || 0).toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button asChild size="sm" variant="ghost" title="View public page">
                      <a href={`/trip/${t.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/admin-7823-secure-panel/trips/${t.id}`}><Pencil className="w-3.5 h-3.5" /></Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(t.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminTripsList;
