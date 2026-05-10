import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ExternalLink, LogOut, ShieldAlert, Map } from "lucide-react";
import logo from "@/assets/logo.png";
import { ADMIN_SECRET_PATH, signOutAdmin } from "@/lib/adminAuth";
import type { Trip } from "@/lib/tripTypes";

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTrips((data as any) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchTrips();
  }, [isAdmin]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete trip for "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Trip removed." });
      fetchTrips();
    }
  };

  const handleSignOut = () => {
    signOutAdmin();
    toast({ title: "Signed out", description: "You have been logged out." });
    navigate(ADMIN_SECRET_PATH);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="max-w-md w-full text-center rounded-2xl border border-slate-200 bg-white p-8">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Access denied</h1>
          <p className="text-slate-500 mt-2">This account does not have admin permissions.</p>
          <Button onClick={handleSignOut} className="mt-6 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EasyTrip India" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Admin Dashboard</div>
              <div className="text-xs text-slate-500">EasyTrip India</div>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 h-9 px-4"
          >
            <LogOut className="w-4 h-4 mr-1" /> Sign out
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Page heading */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Client Trips
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Manage all generated trip pages
            </p>
          </div>
          <Button
            asChild
            className="rounded-full h-11 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm transition-colors"
          >
            <Link to="/admin/trips/new">
              <Plus className="w-4 h-4 mr-1" /> Create New Trip
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading trips...</div>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-5">
              <Map className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No trips yet</h3>
            <p className="text-slate-500 mt-2 text-sm">
              Create your first client trip to get started.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold uppercase tracking-wider">
                    {t.destination}
                  </span>
                  {t.num_days && (
                    <span className="text-xs text-slate-400 font-medium">
                      {t.num_days} days
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-900">{t.client_name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono truncate">/{t.slug}</p>
                {t.start_date && (
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(t.start_date).toLocaleDateString()}
                    {t.end_date && ` – ${new Date(t.end_date).toLocaleDateString()}`}
                  </p>
                )}
                <div className="mt-5 flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Link to={`/trip/${t.slug}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Link to={`/admin/trips/${t.id}/edit`}>
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(t.id, t.client_name)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
