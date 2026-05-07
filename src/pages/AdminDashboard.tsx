import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Package, Plus, Users, Trash2, Pencil } from "lucide-react";
import logo from "@/assets/logo.png";
import { isAdminAuthed, adminLogout } from "@/lib/adminAuth";

type View = "enquiries" | "add" | "manage";

interface Pkg {
  id: string;
  name: string;
  price: string;
  description: string;
}

const STORAGE_KEY = "easytrip_admin_packages";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("enquiries");
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setPackages(JSON.parse(raw));
  }, []);

  if (!isAdminAuthed()) return <Navigate to="/admin-7823-secure-panel" replace />;

  const persist = (next: Pkg[]) => {
    setPackages(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin-7823-secure-panel");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      persist(packages.map((p) => (p.id === editing.id ? { ...editing, ...form } : p)));
      setEditing(null);
    } else {
      persist([...packages, { id: crypto.randomUUID(), ...form }]);
    }
    setForm({ name: "", price: "", description: "" });
    setView("manage");
  };

  const startEdit = (p: Pkg) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, description: p.description });
    setView("add");
  };

  const remove = (id: string) => persist(packages.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="md:w-64 bg-slate-900 text-white p-5 md:min-h-screen">
        <div className="flex items-center gap-2 mb-8">
          <img src={logo} alt="Logo" className="h-10 bg-white rounded-lg p-1" />
          <div>
            <div className="text-xs text-emerald-400 font-bold tracking-widest">ADMIN</div>
            <div className="text-sm font-semibold">Easy Trip India</div>
          </div>
        </div>
        <nav className="space-y-1">
          <NavBtn active={view === "enquiries"} onClick={() => setView("enquiries")} icon={<Users className="w-4 h-4" />}>
            Total Enquiries
          </NavBtn>
          <NavBtn
            active={view === "add"}
            onClick={() => {
              setEditing(null);
              setForm({ name: "", price: "", description: "" });
              setView("add");
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Package
          </NavBtn>
          <NavBtn active={view === "manage"} onClick={() => setView("manage")} icon={<Package className="w-4 h-4" />}>
            Manage Packages
          </NavBtn>
        </nav>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="mt-8 w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {view === "enquiries" && (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Total Enquiries</h1>
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard label="Total Enquiries" value="0" />
              <StatCard label="This Week" value="0" />
              <StatCard label="Converted" value="0" />
            </div>
            <Card className="mt-6 p-8 text-center text-slate-500">
              No enquiries yet.
            </Card>
          </div>
        )}

        {view === "add" && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">{editing ? "Edit Package" : "Add Package"}</h1>
            <Card className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label>Package Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editing ? "Update Package" : "Add Package"}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {view === "manage" && (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Packages</h1>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                        No packages yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    packages.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.price}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

const NavBtn = ({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-white/5"
    }`}
  >
    {icon}
    {children}
  </button>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-5">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
  </Card>
);

export default AdminDashboard;
