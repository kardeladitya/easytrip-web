import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ExternalLink, LogOut, ShieldAlert, Map } from "lucide-react";
import logo from "@/assets/logo.png";
import { ADMIN_SECRET_PATH } from "@/lib/adminAuth";
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate(ADMIN_SECRET_PATH);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-elegant p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="heading-md">Access denied</h1>
          <p className="text-muted-foreground mt-2">
            This account does not have admin permissions.
          </p>
          <Button onClick={handleSignOut} className="mt-6 rounded-full">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-soft">
      <header className="bg-background border-b border-border">
        <div className="container-custom flex items-center justify-between py-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EasyTrip India" className="h-12 object-contain" />
            <div>
              <div className="font-bold text-primary">Admin Dashboard</div>
              <div className="text-xs text-muted-foreground">EasyTrip India</div>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="rounded-full">
            <LogOut className="w-4 h-4 mr-1" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container-custom px-4 md:px-8 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="heading-lg">Client Trips</h1>
            <p className="text-muted-foreground mt-2">Manage all generated trip pages</p>
          </div>
          <Button
            asChild
            className="bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-12 px-6"
          >
            <Link to="/admin/trips/new">
              <Plus className="w-5 h-5 mr-1" /> Create New Trip
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading trips...</div>
        ) : trips.length === 0 ? (
          <div className="card-elegant p-12 text-center">
            <Map className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary">No trips yet</h3>
            <p className="text-muted-foreground mt-2">Create your first client trip to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((t) => (
              <div key={t.id} className="card-elegant p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
                    {t.destination}
                  </span>
                  {t.num_days && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {t.num_days} days
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-primary">{t.client_name}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-mono">/{t.slug}</p>
                {t.start_date && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(t.start_date).toLocaleDateString()}
                    {t.end_date && ` – ${new Date(t.end_date).toLocaleDateString()}`}
                  </p>
                )}
                <div className="mt-5 flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                    <Link to={`/trip/${t.slug}`} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-1" /> View
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to={`/admin/trips/${t.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => handleDelete(t.id, t.client_name)}
                  >
                    <Trash2 className="w-4 h-4" />
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
