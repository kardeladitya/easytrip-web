import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ADMIN_RESET_PATH, ADMIN_SECRET_PATH } from "@/lib/adminAuth";

const AdminForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${ADMIN_RESET_PATH}`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({
      title: "Check your inbox",
      description: "If an admin account exists for that email, a reset link has been sent.",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-soft px-4 py-10">
      <div className="w-full max-w-md card-elegant p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logo} alt="EasyTrip India" className="h-16 object-contain mb-4" />
          <div className="inline-flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </div>
          <h1 className="heading-md mt-2">Forgot Password</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Enter your admin email and we'll send a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center text-sm text-muted-foreground">
            <p>
              If <span className="font-semibold text-foreground">{email}</span> matches an admin
              account, you'll receive a reset email shortly. The link expires after a short time.
            </p>
            <Link
              to={ADMIN_SECRET_PATH}
              className="mt-6 inline-flex items-center gap-1 text-secondary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-secondary-foreground hover:opacity-95 rounded-full h-12 font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
            </Button>
            <div className="text-center">
              <Link
                to={ADMIN_SECRET_PATH}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-3 h-3" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default AdminForgotPassword;
