import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { isAdminSignedIn, signInAdmin } from "@/lib/adminAuth";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (isAdminSignedIn()) navigate("/admin", { replace: true });
  }, [navigate]);

  const validate = () => {
    const next: { username?: string; password?: string } = {};
    if (!username.trim()) next.username = "User ID is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // small delay so the spinner is visible — feels more polished
    await new Promise((r) => setTimeout(r, 250));
    if (signInAdmin(username, password, rememberMe)) {
      toast.success("Signed in successfully");
      navigate("/admin", { replace: true });
    } else {
      toast.error("Invalid User ID or Password");
      setErrors({ password: "Invalid credentials." });
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <img src={logo} alt="EasyTrip India" className="h-14 object-contain mb-4" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-slate-700">User ID</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((p) => ({ ...p, username: undefined }));
                }}
                placeholder="Enter your User ID"
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-emerald-600/30"
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="text-xs text-red-600 mt-1">{errors.username}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  className="h-11 rounded-xl border-slate-200 pr-11 focus-visible:ring-emerald-600/30"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
                className="data-[state=checked]:bg-emerald-700 data-[state=checked]:border-emerald-700"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Restricted access · Authorized personnel only
        </p>
      </div>
    </main>
  );
};

export default AdminLogin;
