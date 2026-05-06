import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_SECRET_PATH } from "@/lib/adminAuth";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (!mounted) return;
        setIsAdmin(false);
        setLoading(false);
        navigate(ADMIN_SECRET_PATH, { replace: true });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      const ok = !!data;
      setIsAdmin(ok);
      setLoading(false);
      if (!ok) navigate(ADMIN_SECRET_PATH, { replace: true });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id);
    });

    supabase.auth.getSession().then(({ data }) => check(data.session?.user?.id));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  return { isAdmin, loading };
};
