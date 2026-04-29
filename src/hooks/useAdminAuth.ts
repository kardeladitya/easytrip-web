import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkRole = async (s: Session | null) => {
      if (!s) {
        if (mounted) {
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          navigate("/auth", { replace: true });
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", s.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) {
        setSession(s);
        setIsAdmin(!!data);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setTimeout(() => checkRole(s), 0);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => checkRole(s));

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, isAdmin, loading };
};
