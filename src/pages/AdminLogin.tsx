import { useState, FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, ShieldAlert } from "lucide-react";
import logo from "@/assets/logo.png";
import { adminLogin, isAdminAuthed } from "@/lib/adminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAdminAuthed()) return <Navigate to="/admin-7823-secure-panel/dashboard" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (adminLogin(username, password)) {
      navigate("/admin-7823-secure-panel/dashboard");
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-emerald-100">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="Easy Trip India" className="h-16 object-contain mb-4" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-700 text-xs font-bold tracking-widest">
            <Lock className="w-3 h-3" /> ADMIN PORTAL
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Restricted access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
