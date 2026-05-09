import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { isAdminSignedIn, signInAdmin } from "@/lib/adminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminSignedIn()) navigate("/admin", { replace: true });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (signInAdmin(username, password)) {
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-soft px-4">
      <div className="w-full max-w-md card-elegant p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="EasyTrip India" className="h-16 object-contain mb-4" />
          <div className="inline-flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </div>
          <h1 className="heading-md mt-2">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-2">Restricted access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-12 font-semibold"
          >
            Sign In
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
