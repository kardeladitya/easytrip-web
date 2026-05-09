// Simple session-based admin gate. NOT cryptographically secure — the admin
// panel is intentionally protected only by a secret URL + hardcoded credentials,
// per product requirements (no Supabase Auth).

export const ADMIN_USERNAME = "easytripadmin";
export const ADMIN_PASSWORD = "EasyTrip@2026";
export const ADMIN_SECRET_PATH = "/admin-7823-secure-panel";
const STORAGE_KEY = "etin_admin_session";

export const signInAdmin = (username: string, password: string) => {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY, "1");
    return true;
  }
  return false;
};

export const isAdminSignedIn = () => sessionStorage.getItem(STORAGE_KEY) === "1";

export const signOutAdmin = () => sessionStorage.removeItem(STORAGE_KEY);
