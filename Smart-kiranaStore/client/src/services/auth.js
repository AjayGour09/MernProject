const API_BASE = "http://localhost:5000/api";

const TOKEN_KEY = "smart_kirana_token";
const USER_KEY = "smart_kirana_user";

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.message || "Request failed";
  } catch {
    return await res.text();
  }
}

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

export const AuthService = {
  async adminRegister(body) {
    return post("/auth/admin/register", body);
  },

  async customerRegister(body) {
    return post("/auth/customer/register", body);
  },

  async adminLogin(body) {
    const data = await post("/auth/admin/login", body);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async customerLogin(body) {
    const data = await post("/auth/customer/login", body);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
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

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};