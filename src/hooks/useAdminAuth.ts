import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_SECRET_PATH, isAdminSignedIn } from "@/lib/adminAuth";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ok = isAdminSignedIn();
    setIsAdmin(ok);
    setLoading(false);
    if (!ok) navigate(ADMIN_SECRET_PATH, { replace: true });
  }, [navigate]);

  return { isAdmin, loading };
};
