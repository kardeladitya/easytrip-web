const KEY = "easytrip_admin_session";
const USERNAME = "EasyTrip@4328";
const PASSWORD = "fTP5kf2N0U";

export const adminLogin = (u: string, p: string): boolean => {
  if (u.trim() === USERNAME && p.trim() === PASSWORD) {
    sessionStorage.setItem(KEY, "1");
    return true;
  }
  return false;
};

export const isAdminAuthed = (): boolean => sessionStorage.getItem(KEY) === "1";

export const adminLogout = (): void => sessionStorage.removeItem(KEY);
