import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, Briefcase, CalendarCheck, Users, CreditCard,
  Settings, LogOut, Bell, Search, Menu, X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAdminAuthed, adminLogout } from "@/lib/adminAuth";

const ADMIN_BASE = "/admin-7823-secure-panel";

const navItems = [
  { to: `${ADMIN_BASE}/dashboard`, icon: LayoutDashboard, label: "Dashboard" },
  { to: `${ADMIN_BASE}/trips/new`, icon: PlusCircle, label: "Create Trip" },
  { to: `${ADMIN_BASE}/trips`, icon: Briefcase, label: "Manage Trips" },
  { to: `${ADMIN_BASE}/bookings`, icon: CalendarCheck, label: "Bookings" },
  { to: `${ADMIN_BASE}/users`, icon: Users, label: "Users" },
  { to: `${ADMIN_BASE}/payments`, icon: CreditCard, label: "Payments" },
  { to: `${ADMIN_BASE}/settings`, icon: Settings, label: "Settings" },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!isAdminAuthed()) return <Navigate to={ADMIN_BASE} replace />;

  const handleLogout = () => {
    adminLogout();
    navigate(ADMIN_BASE);
  };

  const isActive = (to: string) =>
    location.pathname === to ||
    (to.endsWith("/trips") && location.pathname.startsWith(to) && !location.pathname.includes("/new"));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={logo} alt="Logo" className="h-10 bg-white rounded-lg p-1" />
          <div>
            <div className="text-[10px] text-emerald-400 font-bold tracking-widest">ADMIN PORTAL</div>
            <div className="text-sm font-semibold">EasyTrip India</div>
          </div>
          <button className="ml-auto md:hidden text-white/70" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 md:px-6 h-16">
            <button className="md:hidden text-slate-600" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:flex items-center relative">
                <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                <Input className="pl-9 w-64 h-9 bg-slate-50" placeholder="Search..." />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
