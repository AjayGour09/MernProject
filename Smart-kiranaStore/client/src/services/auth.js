const API_BASE = "http://localhost:5000/api";

const TOKEN_KEY = "smart_kirana_token";
const USER_KEY = "smart_kirana_user";
const SHOP_KEY = "smart_kirana_shop";

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.message || "Request failed";
  } catch {
    return await res.text();
  }
}

export const AuthService = {
  async adminLogin(body) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await parseError(res));
    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data;
  },

  async customerLogin(body) {
    const res = await fetch(`${API_BASE}/auth/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await parseError(res));
    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data;
  },

  async customerSetPassword(body) {
    const res = await fetch(`${API_BASE}/auth/customer/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getSelectedShop() {
    try {
      return JSON.parse(localStorage.getItem(SHOP_KEY) || "null");
    } catch {
      return null;
    }
  },

  setSelectedShop(shop) {
    localStorage.setItem(SHOP_KEY, JSON.stringify(shop));
  },

  clearSelectedShop() {
    localStorage.removeItem(SHOP_KEY);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SHOP_KEY);
  },
};