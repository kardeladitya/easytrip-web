// Simple credential gate for the admin panel.
// NOT cryptographically secure — protected only by a secret URL + hardcoded
// credentials, per product requirements (no Supabase Auth).

export const ADMIN_USERNAME = "EasyTrip@4328";
export const ADMIN_PASSWORD = "fTP5kf2N0U";
export const ADMIN_SECRET_PATH = "/admin-7823-secure-panel";

const STORAGE_KEY = "etin_admin_session";

export const signInAdmin = (
  username: string,
  password: string,
  rememberMe = false,
) => {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Clear both stores first to avoid stale sessions
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem(STORAGE_KEY, "1");
    return true;
  }
  return false;
};

export const isAdminSignedIn = () =>
  localStorage.getItem(STORAGE_KEY) === "1" ||
  sessionStorage.getItem(STORAGE_KEY) === "1";

export const signOutAdmin = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
};
