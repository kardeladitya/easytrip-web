import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, Users, IndianRupee, PlusCircle, ArrowUpRight } from "lucide-react";
import { listTrips } from "@/lib/tripsApi";
import type { Trip } from "@/lib/tripTypes";

const AdminDashboard = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTrips()
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = trips.reduce((sum, t) => sum + (Number(t.total_cost) || 0), 0);
  const recent = trips.slice(0, 5);

  const stats = [
    { label: "Total Trips", value: trips.length, icon: Briefcase, gradient: "from-emerald-500 to-teal-600", trend: "+12%" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, gradient: "from-amber-500 to-orange-600", trend: "+8%" },
    { label: "Active Clients", value: trips.length, icon: Users, gradient: "from-blue-500 to-indigo-600", trend: "+5%" },
    { label: "Conversion", value: "92%", icon: TrendingUp, gradient: "from-pink-500 to-rose-600", trend: "+3%" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Greeting */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold">Welcome back, Admin 👋</h2>
            <p className="mt-2 text-white/80">Here's an overview of EasyTrip India today.</p>
            <Button asChild className="mt-5 bg-white text-emerald-700 hover:bg-white/90 font-semibold">
              <Link to="/admin-7823-secure-panel/trips/new">
                <PlusCircle className="w-4 h-4 mr-2" /> Create New Trip
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="p-5 hover:shadow-lg transition-shadow border-0 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{s.trend}</span>
                </div>
                <div className="mt-4 text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Recent trips */}
        <Card className="p-5 md:p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Trips</h3>
              <p className="text-sm text-slate-500">Latest itineraries created</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin-7823-secure-panel/trips">
                View all <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="py-10 text-center text-slate-400">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="py-10 text-center text-slate-400">No trips yet. Create your first trip.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((t) => (
                <div key={t.id} className="py-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold">
                    {t.client_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{t.client_name}</div>
                    <div className="text-sm text-slate-500 truncate">
                      {t.destination} · {t.num_days || 0} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{Number(t.total_cost || 0).toLocaleString("en-IN")}</div>
                    <Link to={`/admin-7823-secure-panel/trips/${t.id}`} className="text-xs text-emerald-600 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
